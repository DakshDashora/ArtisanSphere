from fastapi import APIRouter

from typing import Dict
import uuid
from Utils.story import toString
from schemas import Product, ReturnSessionSchema, QuizDoneSchema, Answer
from Config.gemini import model
from Config.prompts import nextQuestionPrompt, storyPrompt

router = APIRouter(prefix="/story", tags=["story"])

# Simple in-memory session store
sessions: Dict[str, Dict] = {}


def get_text(response) -> str:
    """Safely extract text from Gemini response object"""
    try:
        return response.text.strip()
    except AttributeError:
        # fallback if response has candidates list
        return response.candidates[0].content.parts[0].text.strip()


@router.post("/start-session", response_model=ReturnSessionSchema)
def start_session(product:Product):
    session_id = str(uuid.uuid4())
    first_question = "Tell me about yourself as an artisan."

    sessions[session_id] = {
        "history": [{"q": first_question, "a": None}],
        "count": 0,
        "title":product.title,
        "image":product.image_url
    }
    

    print("session created successfully:", session_id)
    return ReturnSessionSchema(
        sessionId=session_id,
        question=first_question
    )


@router.post("/answer", response_model=QuizDoneSchema)
def submit_answer(data: Answer):
    session = sessions.get(data.session_id)
    if not session:
        return {"error": "Invalid session"}

    # Normalize answer
    ans = (data.answer or "").strip()

    # Fill last unanswered question
    if session["history"] and session["history"][-1]["a"] is None:
        session["history"][-1]["a"] = ans
    else:
        return {"error": "No pending question to answer"}

    session["count"] += 1

    # ✅ Stop condition first, return immediately
    if ans == "__STOP__" or session["count"] >= 10:
        history_text = toString(session["history"])
        story_prompt = storyPrompt(history_text, session["title"], session["image"])
        story = model.generate_content(story_prompt)
        print(get_text(story))
        return QuizDoneSchema(
            done=True,
            question=get_text(story)
        )

    # Otherwise → generate next question
    history_text = toString(session["history"])
    prompt = nextQuestionPrompt(history_text, session["title"], session["image"])
    next_q = model.generate_content(prompt)
    next_q_text = get_text(next_q)
    print(next_q_text)
    session["history"].append({"q": next_q_text, "a": None})

    return QuizDoneSchema(
        done=False,
        question=next_q_text
    )
