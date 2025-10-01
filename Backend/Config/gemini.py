
from google.cloud import vision
from google.cloud import firestore
import google.generativeai as genai
import os



genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

vision_client = vision.ImageAnnotatorClient()
db = firestore.Client()
model = genai.GenerativeModel("models/gemini-2.5-flash")
