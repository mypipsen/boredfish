import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { TopNav } from '@/components/TopNav';
import { SearchBar } from '@/components/SearchBar';
import { MediaCard } from '@/components/MediaCard';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/useToast';
import { Search, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Media } from '@/types';
import { searchMedia, addMedia } from '@/services/api';
import { ERROR_MESSAGES } from '@/constants';

type ViewMode = 'selection' | 'search' | 'chat';

const Index = () => {
  const { messages, sendMessage, isLoading: isChatLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const { toast } = useToast();

  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, viewMode]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const data = await searchMedia(query);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.SEARCH_FAILED,
        variant: 'destructive',
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRate = async (media: Media, liked: boolean) => {
    try {
      await addMedia({
        id: media.id,
        title: media.title,
        year: media.year,
        releaseDate: media.releaseDate,
        poster: media.poster,
        type: media.type,
        rating: media.rating,
        description: media.description,
        status: 'archived',
        liked,
      });

      toast({
        title: liked ? 'Liked and Archived' : 'Disliked and Archived',
        description: `${media.title} has been rated and moved to archive.`,
      });

      // Update local state to reflect change
      setSearchResults((prev) =>
        prev.map((m) => (m.id === media.id ? { ...m, liked, status: 'archived' } : m))
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rate media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-background/95">
      <TopNav onDiscoverClick={() => setViewMode('selection')} />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl py-6 h-full">
          {/* Selection View */}
          {viewMode === 'selection' && (
            <div className="flex h-full flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-500">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Discover
                </h1>
                <p className="text-muted-foreground text-lg">Choose how you want to explore</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
                <button
                  onClick={() => setViewMode('search')}
                  className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-card/50 hover:bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Search className="w-12 h-12" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-semibold">Manual Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for specific movies and TV shows directly
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setViewMode('chat')}
                  className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-card/50 hover:bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-semibold">AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized recommendations and chat
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Search View */}
          {viewMode === 'search' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('selection')}
                  className="rounded-full hover:bg-secondary"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-semibold">Search</h2>
              </div>

              <SearchBar onSearch={handleSearch} isLoading={isSearching} />

              {!hasSearched && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-muted-foreground/50">Suggested</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 opacity-50">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <Skeleton className="h-40 w-28 rounded" />
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-16 w-full" />
                          <div className="mt-auto flex justify-between">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSearched && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {searchResults.length > 0 ? 'Search Results' : 'No results found'}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {searchResults.map((media) => (
                      <MediaCard
                        key={media.id}
                        media={media}
                        showAddButton
                        showLikeButtons
                        onRate={(liked) => handleRate(media, liked)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat View */}
          {viewMode === 'chat' && (
            <div className="flex flex-col h-[calc(100vh-8rem)] animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('selection')}
                  className="rounded-full hover:bg-secondary"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-semibold">AI Assistant</h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    movies={message.movies}
                  />
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/80 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="pt-4 mt-auto">
                <ChatInput onSend={sendMessage} disabled={isChatLoading} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
