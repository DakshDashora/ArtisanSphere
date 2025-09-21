
from google.cloud import vision
from google.cloud import firestore
import google.generativeai as genai
import os

#use your own api credentials here
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "Config/artistsphere-cdab2-26b0de95ff1c.json"

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


vision_client = vision.ImageAnnotatorClient()
db = firestore.Client()
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")