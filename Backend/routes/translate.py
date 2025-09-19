from fastapi import  APIRouter

from google.cloud import translate_v2 as translate

from schemas import TranslateRequest, TranslateResponse

# Initialize FastAPI

router=APIRouter(prefix="/translate", tags=["translate"])
# Initialize Google Translate client
client = translate.Client()

# Request body schema


@router.post("/translate")
async def translate_text(req: TranslateRequest):
    """
    Translate text into target language using Google Cloud Translation API
    """
    try:
        result = client.translate(req.text, target_language=req.target_language)
        return TranslateResponse(
            success=True,
            translated_text=result["translatedText"]
        )
    except Exception as e:
        return {"error": str(e)}
