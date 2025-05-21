from fastapi import FastAPI
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import json

load_dotenv()
app = FastAPI()

class MCPRequest(BaseModel):
    text: str


@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/mcp")
def mcp_parser(request: MCPRequest):
    llm = init_chat_model("google_genai:gemini-2.0-flash")

    prompt = f"""
    Extraia em JSON válido (sem markdown) com os campos:
    - action (string)
    - date (string no formato YYYY-MM-DD)
    - time (string no formato HH:MM)
    - local (string ou null)
    Texto: {request.text}
    Retorne APENAS o JSON, sem comentários ou markdown.
    Exemplo: {{"ação": "valor", "data": "...", ...}}
    """
    response = llm.invoke(prompt).content
    formatted_response = response.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(formatted_response)
