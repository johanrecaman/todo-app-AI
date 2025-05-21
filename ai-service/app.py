from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.tools import tool
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import requests

load_dotenv()

class State(TypedDict):
    messages: Annotated[list, add_messages]

@tool
def call_parser(input: str) -> dict:
    """Extrai compromissos de textos como 'Reunião amanhã às 15h' ou 'Consulta na sexta'.
    Chame SEMPRE que o usuário mencionar:
    - Consultas, reuniões, eventos
    - Datas/horários (hoje, amanhã, dias da semana)
    - Locais específicos (opcional)
    Retorna:
        {
            "evento": str,         # Ex: "consulta médica"
            "data": str,           # Formato "YYYY-MM-DD"
            "hora": str,           # Formato "HH:MM"
            "local": str,          # Opcional
            "recorrente": bool    # Ex: True para "toda sexta"
        }
    """
    response = requests.post("http://mcp-server:8080/mcp", json={"text": input})
    return response.json()

llm = init_chat_model("google_genai:gemini-2.0-flash")
tool_instance = call_parser
tools = [tool_instance]
llm_with_tools = llm.bind_tools(tools)

graph_builder = StateGraph(State)

def chatbot(state: State):
    response_message = llm_with_tools.invoke(state["messages"])
    return {"messages": [response_message]}

graph_builder.add_node("chatbot", chatbot)

tool_node = ToolNode(tools=tools)
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges("chatbot", tools_condition)

graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")

graph = graph_builder.compile()

if __name__ == "__main__":
    test_cases = [
        "Tenho consulta médica amanhã às 14h",
        "Reunião com o time toda segunda-feira às 10h",
        "Vou no dentista dia 15/07 às 16:30",
        "Encontro com a Ana no shopping às 19h"
    ]
    for input_text in test_cases:
        print(f"\nInput: '{input_text}'")
        result = call_parser.invoke({"input": input_text})
        print("Resultado:", result)
