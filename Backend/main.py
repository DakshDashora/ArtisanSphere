from routes import image_desc, story, translate, poster
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# Initialize Firebase app (once in your main app)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(image_desc.router)
app.include_router(story.router)
app.include_router(translate.router)
app.include_router(poster.router)



    





