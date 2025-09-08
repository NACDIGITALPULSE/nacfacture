import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { messages, loading, sendMessage } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          "fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 transition-all duration-200",
          isMinimized ? "h-12" : "h-96"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer">
            <CardTitle 
              className="text-sm font-medium"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              Chat Support
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex flex-col h-full p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                {loading ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Chargement...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Aucun message pour le moment
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.user_id === user.id ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          message.user_id === user.id
                            ? "bg-primary text-primary-foreground"
                            : message.is_admin
                            ? "bg-accent text-accent-foreground border border-border"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <div className="font-medium text-xs mb-1 opacity-75">
                          {message.is_admin ? "Support" : message.sender_name}
                        </div>
                        <div>{message.message}</div>
                        <div className="text-xs opacity-50 mt-1">
                          {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatWidget;