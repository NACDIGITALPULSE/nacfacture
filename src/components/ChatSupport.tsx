import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  user_id: string;
  sender_name: string;
  message: string;
  is_admin: boolean | null;
  created_at: string;
}

const ChatSupport = () => {
  const { user, isAdmin } = useAuth();
  const { profile } = useUserProfile(user);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Utilisateur";

  useEffect(() => {
    if (!open || !user) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      sender_name: isAdmin ? "Support NAC" : displayName,
      message: newMessage.trim(),
      is_admin: isAdmin,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
    setNewMessage("");
    setSending(false);
  };

  if (!user) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-xl hover:scale-105 transition-transform"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col" style={{ height: 460 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-2xl">
        <span className="font-semibold text-sm">💬 Chat Support</span>
        <button onClick={() => setOpen(false)} className="hover:opacity-70">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-xs mt-8">
            Aucun message. Commencez la conversation !
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.user_id === user.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : msg.is_admin
                    ? "bg-green-100 text-green-900 rounded-bl-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm"
                }`}
              >
                <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                  {msg.sender_name}
                </div>
                <div className="break-words">{msg.message}</div>
                <div className="text-[9px] opacity-50 text-right mt-0.5">
                  {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
          className="text-sm"
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={sending}
        />
        <Button size="icon" onClick={handleSend} disabled={sending || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatSupport;
