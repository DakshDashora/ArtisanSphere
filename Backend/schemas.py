from pydantic import BaseModel  


class OneDescription(BaseModel):
    title:str
    text:str

class ReturnDescriptionSchema(BaseModel):
    status:bool
    aiDescription:list[str]

class Product(BaseModel):
    title: str
    image_url: str | None = None

class ReturnSessionSchema(BaseModel):
    sessionId:str
    question:str

class QuizDoneSchema(BaseModel):
    done:bool
    question:str

class Answer(BaseModel):
    session_id: str
    answer: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class TranslateResponse(BaseModel):
    success:bool
    translated_text:str

class PosterRequest(BaseModel):
    title: str
    description: str
    image_url: str
    style: str = "modern artisan"
    language: str = "en"

class PosterURL(BaseModel):
    success:bool
    poster_url:str