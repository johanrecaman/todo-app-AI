from dotenv import load_dotenv
from typing import Annotated, List
from typing_extensions import TypedDict

from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.tools import tool
from langchain.chat_models import init_chat_model

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.prebuilt import create_react_agent

from datetime import datetime
import requests

load_dotenv()

@tool
def get_current_time():
    """
    Retorna a data e hora atuais no formato YYYY-MM-DD HH:MM.
    """
    now = datetime.now()
    return now.strftime('%Y-%m-%d %H:%M')

@tool
def add_reminder(title, location, time, date):
    """
    Cria um lembrete a partir de uma mensagem em linguagem natural.

    O sistema interpreta automaticamente:
    - Título do lembrete (crie com base na mensagem)
    - Data e hora, incluindo expressões relativas como 'amanhã', 'daqui 2 horas' ou 'hoje às 10h'
    - Local (opcional)

    As datas são convertidas para o formato YYYY-MM-DD.
    Os horários seguem o padrão HH:MM (24 horas).

    Exemplos de mensagens válidas:
    - "Me lembre da consulta no dentista amanhã às 14h"
    - "Reunião com o time na sala 3 às 10:30"
    - "Preciso levar o carro pra lavar sexta-feira"
    - "Encontrar com Nicole daqui 2 horas"

    Retorna uma confirmação de criação bem-sucedida ou uma mensagem de erro caso não seja possível processar a solicitação.
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

@tool
def get_reminders():
    """
    Lista todos os lembretes salvos.
    """
    url = "http://localhost:3001/reminders"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return f"Error fetching reminders: {str(e)}"

class State(TypedDict):
    messages:Annotated[List[HumanMessage | AIMessage], add_messages]

llm = init_chat_model("google_genai:gemini-2.0-flash")
tools = [add_reminder, get_reminders, get_current_time]

reminder_agent = create_react_agent(
    model = llm,
    tools = tools,
    prompt = "Você é um assistente que ajuda a criar lembretes a partir de mensagens em linguagem natural.",
)

workflow = StateGraph(State)

workflow.add_node("reminder_agent", reminder_agent)

workflow.add_edge(START, "reminder_agent")

graph = workflow.compile()
