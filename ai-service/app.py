from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict
import requests

class State(TypedDict):
    input: str
    output: dict

def call_parser(input: str):
    response = requests.post(
        "http://mcp-server:8080/mcp",
        json={"text": input}
    )
    return response.json()

def parser_agent(state: State):
    state["output"] = call_parser(state["input"])
    return state

graph = StateGraph(State)
graph.add_node("parser", parser_agent)

graph.add_edge(START, "parser")
graph.add_edge("parser", END)

app = graph.compile()
