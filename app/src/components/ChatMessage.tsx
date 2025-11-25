import { cn } from '@/lib/utils';
import { MediaCard } from './MediaCard';
import { Media } from '@/types';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  movies?: Media[];
}

export const ChatMessage = ({ message, isUser, movies }: ChatMessageProps) => {
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
        {message}
        {movies && movies.length > 0 && (
          <div className="mt-4 space-y-3">
            {movies.map((media) => (
              <MediaCard key={media.id} media={media} showAddButton />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
