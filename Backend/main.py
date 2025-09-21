from routes import image_desc, story, translate, poster
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for now (easier in Cloud Run)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include your routers
app.include_router(image_desc.router)
app.include_router(story.router)
app.include_router(translate.router)
app.include_router(poster.router)
