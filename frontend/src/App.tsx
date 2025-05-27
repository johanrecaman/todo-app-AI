import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, 
        { sender: 'bot', text: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-4">Chatbot LangGraph</h1>
      
      <div className="h-96 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 my-2 rounded-lg max-w-xs ${msg.sender === 'user' 
              ? 'ml-auto bg-green-100 text-green-900' 
              : 'mr-auto bg-gray-200 text-gray-900'}`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto bg-gray-200 text-gray-900 p-3 rounded-lg max-w-xs">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;
