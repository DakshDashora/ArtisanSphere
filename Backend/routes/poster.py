import base64
from datetime import datetime
import httpx
import firebase_admin
from fastapi import APIRouter, Depends
from fastapi.concurrency import run_in_threadpool
from firebase_admin import credentials, storage as fb_storage

# Import Vertex AI libraries for image generation
import vertexai
from vertexai.preview.vision_models import Image, ImageGenerationModel

from schemas import PosterRequest, PosterURL

# --- Initialization (do this once when your app starts) ---

# Initialize Vertex AI
# Replace with your actual project and location
try:
    vertexai.init(project="954502962692", location="us-central1")
except Exception as e:
    print(f"Warning: Vertex AI initialization failed. Error: {e}")
    print("Please ensure you have set your GCP project and location and are authenticated.")


# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate("Config/artistsphere-cdab2-26b0de95ff1c.json")
    firebase_admin.initialize_app(cred, {"storageBucket": "artistsphere-cdab2.firebasestorage.app"})

router = APIRouter(prefix="/poster", tags=["poster"])

def get_storage_bucket():
    return fb_storage.bucket()

# --- API Route ---

@router.post("/create-poster/", response_model=PosterURL)
async def create_poster(request: PosterRequest, bucket=Depends(get_storage_bucket)):
    # Fetch the product image asynchronously
    async with httpx.AsyncClient() as client:
        resp = await client.get(request.image_url)
        resp.raise_for_status()
        img_content = await resp.aread()

    # Construct the prompt for image editing
    prompt = f"""
    Using the provided image of a product, create a visually stunning marketing poster.
    - Add a stylish, complementary background that fits the product's aesthetic: {request.style}.
    - Elegantly incorporate the following text into the design:
        - Title: {request.title}
        - Description: {request.description}
    - The final poster should be suitable for social media marketing.
    - It is appreciable to have creative text in beautiful font on the poster
    - The image should be similar to provided image
    - Language for any text on the poster: {request.language}.
    """

    # Generate the poster using Imagen in a thread pool
    def edit_image_sync():
        model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base_image = Image(image_bytes=img_content)
        
        # The edit_image function will use the prompt to modify the base image.
        # For more precise control, you can add a 'mask' to protect parts of the original image.
        response = model.edit_image(
            base_image=base_image,
            prompt=prompt,
            number_of_images=1,
            mask=base_image,
            mask_mode="foreground"
        )
        # The response contains the generated image bytes
        return response.images[0]._image_bytes

    poster_bytes = await run_in_threadpool(edit_image_sync)

    # Upload to Firebase Storage in a thread pool
    def upload_to_firebase():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        blob = bucket.blob(f"posters/{timestamp}.png")
        blob.upload_from_string(poster_bytes, content_type="image/png")
        blob.make_public()
        return blob.public_url

    poster_url = await run_in_threadpool(upload_to_firebase)

    return PosterURL(success=True, poster_url=poster_url)