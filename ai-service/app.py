import json
from dotenv import load_dotenv

from typing_extensions import TypedDict
from langchain.chat_models import init_chat_model
from langgraph.graph import StateGraph
from langgraph.constants import START, END

load_dotenv()

class State(TypedDict):
    input: str
    output: dict

llm = init_chat_model("google_genai:gemini-2.0-flash")

def clean_json(text: str):
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text

def parser_agent(state: State):
    text = state["input"]
    prompt =f"""
    Responda apenas com JSON começando e terminando com {{ }}.
    Responda apenas com o JSON, sem nenhuma marcação de código ou texto extra. NÃO coloque ```json nem ``` no início ou fim.
    Campos: acao, data, hora, local
    Se faltar algum, coloque null.
    Texto: {text}
    """
    response = clean_json(llm.invoke(prompt).content)
    state["output"] = json.loads(response)
    print(response)

graph = StateGraph(State)
graph.add_node("parser", parser_agent)

graph.add_edge(START, "parser")
graph.add_edge("parser", END)

graph.compile().invoke({"input": "Hoje, 12 de outubro de 2023, às 15:00, vou ao cinema."})
