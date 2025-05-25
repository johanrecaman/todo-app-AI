from dotenv import load_dotenv
from typing import Annotated, List
from typing_extensions import TypedDict

from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.tools import tool
from langchain.chat_models import init_chat_model

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

import requests

load_dotenv()

@tool
def add_reminder(title, location, time, date):
    """
    Transforma uma mensagem normal em lembrete, extraindo automaticamente da linguagem natural os seguintes campos:
        - O que precisa ser lembrado (título)
        - Quando (data e hora)
        - Onde (opcional)

    Exemplos de mensagens que funcionam:
        - "Me lembre da consulta no dentista amanhã às 14h"
        - "Reunião com o time na sala 3 às 10:30"
        - "Preciso levar o carro pra lavar sexta-feira"

    Retorna o lembrete pronto para salvar ou mensagem de erro se não entender.

    Obs: Data/hora são convertidas para formato padrão (YYYY-MM-DD e HH:MM). 
    """
    url = "http://localhost:3001/reminders"
    data = {
        "title": title,
        "location": location,
        "time": time,
        "date": date
    }
    try:
        response = requests.post(url, json=data, timeout=5)
        response.raise_for_status()
        return "Reminder successfully created!"
    except requests.exceptions.RequestException as e:
        return f"Error creating reminder: {str(e)}"

class State(TypedDict):
    messages:Annotated[List[HumanMessage | AIMessage], add_messages]

llm = init_chat_model("google_genai:gemini-2.0-flash")
graph_builder = StateGraph(State)

tool = add_reminder
tools = [tool]
llm_with_tools = llm.bind_tools(tools)

def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

graph_builder.add_node("chatbot", chatbot)

tool_node = ToolNode(tools=[tool])
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges(
    "chatbot",
    tools_condition,
)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile()
