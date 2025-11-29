import { cn } from '../lib/utils';
import type { Message } from '../types';
import { MediaCard } from './MediaCard';

type ChatMessageProps = {
  message: Message;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full animate-in fade-in-50 slide-in-from-bottom-2 duration-300 whitespace-pre-wrap',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed sm:max-w-[75%] shadow-lg',
          isUser
            ? 'bg-primary text-primary-foreground shadow-primary/20'
            : 'bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-black/10 border border-border/30'
        )}
      >
        {message.content.text}
        {message.content.media && message.content.media.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.content.media.map((mediaItem) => (
              <MediaCard key={mediaItem.id} media={mediaItem} showAddButton />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
