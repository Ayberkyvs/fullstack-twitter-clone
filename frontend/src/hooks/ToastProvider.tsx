import React from 'react';

interface Message {
  type: "success" | "error" | "warning";
  message: string;
  id: number;
}

const ToastContext = React.createContext<((type: Message["type"], message: Message["message"]) => void) | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = React.useState<Message[]>([]); // useState için Message[] tipi

  const addToast = (type: Message["type"], message: Message["message"]) => {
    const newMessage = { type, message, id: Date.now() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== newMessage.id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast toast-bottom toast-center">
        {messages.map((msg) => (
          <div key={msg.id} className={`alert alert-${msg.type}`}>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
