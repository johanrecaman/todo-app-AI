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
        Analise o texto a seguir e extraia as seguintes informações em um objeto JSON válido:

        Campos obrigatórios:
            - "action" (string): a ação principal descrita no texto
            - "date" (string): data no formato YYYY-MM-DD (use null se não encontrada)
            - "time" (string): horário no formato HH:MM (use null se não encontrado)
            - "local" (string): localização mencionada (use null se não encontrada)

        Regras:
            - Retorne SOMENTE o objeto JSON, sem nenhum texto adicional
            - Use aspas duplas para strings ("), não aspas simples
            - Se uma informação não for encontrada, use null como valor
            - Normalize os valores para o formato especificado
            - Não inclua markdown ou comentários

        Texto a ser analisado: "{request.text}"

        Exemplo de saída válida:
        {{"action": "reunião de equipe", "date": "2023-12-25", "time": "14:30", "local": "sala de conferências"}}"""
    response = llm.invoke(prompt).content
    formatted_response = response.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(formatted_response)
