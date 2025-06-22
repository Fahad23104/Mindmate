from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import re

app = FastAPI()

# Enable CORS for all origins (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face config
HF_TOKEN = "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"
MODEL_ID = "HuggingFaceH4/zephyr-7b-beta"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

# Request schemas
class ChatRequest(BaseModel):
    message: str

class AnalyzeRequest(BaseModel):
    text: str

# Chat endpoint
@app.post("/chat")
async def chat(req: ChatRequest):
    user_input = req.message.strip()

    prompt = (
        f"[INST] <<SYS>>\n"
        f"You are a helpful and empathetic mental health assistant. "
        f"Respond directly and compassionately without repeating the user's message or adding tags like <<USER>>.\n"
        f"<</SYS>>\n{user_input} [/INST]"
    )

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 250,
            "temperature": 0.7,
            "top_p": 0.9,
            "do_sample": True
        },
        "options": {
            "wait_for_model": True
        }
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)

    if response.status_code == 200:
        result = response.json()
        if isinstance(result, list) and "generated_text" in result[0]:
            generated = result[0]["generated_text"]

            # Extract response after [/INST]
            reply = generated.split("[/INST]")[-1].strip()

            # Remove hallucinated tags like <<USER>> or <|USER|>
            reply = re.sub(r"<<\s*USER\s*>>", "", reply)
            reply = re.sub(r"<\|/?USER\|>", "", reply)
            reply = re.sub(r"<\|/?ASSISTANT\|>", "", reply)
            reply = reply.strip()

            return {"response": reply}
        else:
            return {"response": "⚠️ Unexpected response format from model."}
    elif response.status_code == 403:
        return {"response": "❌ Access denied. Accept the model license on Hugging Face."}
    elif response.status_code == 404:
        return {"response": "❌ Model not found. Check MODEL_ID or access."}
    else:
        return {"response": f"⚠️ API error: {response.status_code} - {response.text}"}

# Sentiment analysis endpoint
@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    text = req.text.lower()
    if any(word in text for word in ["happy", "joy", "grateful"]):
        return {"label": "POSITIVE", "score": 0.95}
    elif any(word in text for word in ["sad", "depressed", "angry", "tired", "anxious"]):
        return {"label": "NEGATIVE", "score": 0.85}
    else:
        return {"label": "NEUTRAL", "score": 0.60}
