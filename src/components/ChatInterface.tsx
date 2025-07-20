import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MongoLeafIcon from './MongoLeafIcon';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  backendPort?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ backendPort = "3000" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "check the status of testbedmongo?",
    "list all databases in testbedmongo!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSampleClick = (question: string) => {
    setInputValue(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setHasStartedChat(true);

    try {
      const response = await fetch(`http://localhost:${backendPort}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.content }),
      });

      const data = await response.json();
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I could not process your request.',
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error connecting to the server.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="bg-background border-b border-border p-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <MongoLeafIcon size={32} className="mr-3" />
            <h1 className="text-2xl font-bold text-primary">MongoMuse.ai</h1>
          </div>
        </div>
      </header>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Initial Greeting and Samples */}
          {!hasStartedChat && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 mb-8">
                <MongoLeafIcon size={24} className="mt-1" />
                <div className="flex-1">
                  <div className="text-foreground">
                    <p className="text-lg">Hello there!👋</p>
                    <p className="text-muted-foreground mt-1">How can I help you today?</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {sampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSampleClick(question)}
                    className="text-left h-auto py-3 px-4 whitespace-normal"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'agent' && (
                    <div className="flex items-center space-x-1">
                      <MongoLeafIcon size={24} />
                      <span className="text-sm text-muted-foreground">.ai</span>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-3xl rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-user-message text-white ml-auto'
                        : 'bg-transparent text-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Animation */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-1">
                    <MongoLeafIcon size={24} />
                    <span className="text-sm text-muted-foreground">.ai</span>
                  </div>
                  <div className="bg-transparent text-foreground rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="ask me anything about MongoDB..."
              className="flex-1 h-12 text-base px-4"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="h-12 px-6 bg-send-button hover:bg-send-button/90 text-white"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;