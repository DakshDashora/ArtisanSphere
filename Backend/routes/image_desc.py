from fastapi import APIRouter,  HTTPException
from Utils.descr import extract_direct_image_url, split_responses
from schemas import  Product, ReturnDescriptionSchema
from Config.gemini import vision_client, model
from Config.prompts import imageDescriptionPrompt

router=APIRouter(prefix="/create", tags=["create"])

@router.post("/generate-description", response_model=ReturnDescriptionSchema)
async def generate_description(product: Product):
    try:
        description_input = ""
       
        if product.image_url:
          
            
            clean_url = extract_direct_image_url(product.image_url)
            response = vision_client.label_detection({"source": {"image_uri": clean_url}})
            labels = [label.description for label in response.label_annotations]
            
            if labels:
                description_input = f"This product image seems to show: {', '.join(labels[:5][0])} and Product name: {product.title}"
            else:
                description_input = f"Product name: {product.title}"
        else:
            description_input = f"Product name: {product.title}"

       

        prompt = (
            f"{imageDescriptionPrompt}"
    f"Input: {description_input}"   
    )



        result = model.generate_content(prompt)
       
        separated = split_responses(result.text.strip())
    
        return ReturnDescriptionSchema(
            status=True,
            aiDescription=separated
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




