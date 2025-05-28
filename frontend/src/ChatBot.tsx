import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
}

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (text: string, messageId: number) => {
    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];

      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, text: currentText, isStreaming: i < words.length - 1 }
          : msg
      ));

      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const botMessageId = Date.now() + 1;
    const initialBotMessage: Message = {
      id: botMessageId,
      text: '',
      isUser: false,
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {
      const response = await fetch('http://localhost:5050/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversation_id: 'default'
        })
      });

      const data = await response.json();
      setIsTyping(false);
      await simulateTyping(data.response, botMessageId);

    } catch (error) {
      setIsTyping(false);
      await simulateTyping('Erro ao conectar com o servidor. Verifique se a API está rodando.', botMessageId);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-[700px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col">

      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Chat</h1>
            <p className="text-sm text-gray-500">Assistente virtual</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Limpar conversa"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Olá! 👋</h3>
            <p className="text-gray-500 max-w-sm">
              Como posso ajudá-lo hoje? Digite sua pergunta abaixo.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser ? 'bg-gray-500' : 'bg-blue-500'
                }`}>
                {message.isUser ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              <div className={`max-w-2xl px-4 py-3 rounded-2xl ${message.isUser
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-900'
                }`}>
                <p className="text-sm leading-relaxed">
                  {message.text}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                  )}
                </p>
              </div>
            </div>
          ))}

          {isTyping && messages[messages.length - 1]?.text === '' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            disabled={isTyping}
          />

          <button
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isTyping || !input.trim()
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
              }`}
          >
            <Send className={`w-5 h-5 ${isTyping || !input.trim() ? 'text-gray-400' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
