from typing import Annotated
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

from langchain_core.tools import tool
from langchain.chat_models import init_chat_model

from dotenv import load_dotenv
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
from pydantic import BaseModel


load_dotenv()

class State(TypedDict):
    messages: Annotated[list, add_messages]
    parser_data: dict

@tool
def call_parser(input: str) -> dict:
    """Extrai compromissos de textos como 'Reunião amanhã às 15h' ou 'Consulta na sexta'.
    Chame SEMPRE que o usuário mencionar:
    - Consultas, reuniões, eventos
    - Datas/horários (hoje, amanhã, dias da semana)
    - Locais específicos (opcional)
    """
    response = requests.post(
        "http://mcp-server:8080/mcp",
        json={"text": input}
    )
    return {"messages": response.json()}

llm = init_chat_model("google_genai:gemini-2.0-flash")
tools = [call_parser]
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

app = FastAPI()

class ChatInput(BaseModel):
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(data: ChatInput):
    result = graph.invoke({"messages": [HumanMessage(content=data.message)]})
    return result["messages"][-1]

