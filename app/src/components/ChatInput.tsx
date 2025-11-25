import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 py-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for movies or TV shows..."
        disabled={disabled}
        className={cn(
          "flex-1 bg-secondary/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground",
          "rounded-2xl px-5 py-4 text-sm outline-none",
          "border border-border/50",
          "focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-lg shadow-black/5"
        )}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="h-14 w-14 shrink-0 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};
