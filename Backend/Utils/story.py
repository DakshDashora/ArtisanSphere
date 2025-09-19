def toString(history: dict)->str:
    history_text = ""
    for i, qa in enumerate(history, 1):
        question = qa["q"]
        answer = qa.get("a", "…")
        history_text += f"{i}. Q: {question}\n   A: {answer}\n"
    return history_text