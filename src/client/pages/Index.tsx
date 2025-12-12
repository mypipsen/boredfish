import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MediaCard } from '../components/MediaCard';
import { SearchBar } from '../components/SearchBar';
import { TopNav } from '../components/TopNav';
import { Skeleton } from '../components/ui/skeleton';
import { ERROR_MESSAGES } from '../constants';
import { useToast } from '../hooks/useToast';
import {
  addMedia,
  getTrendingMovies,
  getTrendingTvShows,
  getUpcomingMedia,
  searchMedia,
} from '../services/api';
import { Media } from '../types';

const Index = () => {
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Media[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [trendingTv, setTrendingTv] = useState<Media[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isLoadingTrendingMovies, setIsLoadingTrendingMovies] = useState(true);
  const [isLoadingTrendingTv, setIsLoadingTrendingTv] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await getUpcomingMedia();
        setUpcomingMovies(data);
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to load upcoming movies.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    const fetchTrendingMovies = async () => {
      try {
        const data = await getTrendingMovies();
        setTrendingMovies(data);
      } catch (_error) {
        console.error('Failed to load trending movies');
      } finally {
        setIsLoadingTrendingMovies(false);
      }
    };

    const fetchTrendingTv = async () => {
      try {
        const data = await getTrendingTvShows();
        setTrendingTv(data);
      } catch (_error) {
        console.error('Failed to load trending TV shows');
      } finally {
        setIsLoadingTrendingTv(false);
      }
    };

    fetchUpcoming();
    fetchTrendingMovies();
    fetchTrendingTv();
  }, [toast]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchMedia(query);
      setSearchResults(data);
    } catch (_error) {
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
      if (searchQuery) {
        setSearchResults((prev) =>
          prev.map((m) => (m.id === media.id ? { ...m, liked, status: 'archived' } : m))
        );
      } else {
        setUpcomingMovies((prev) =>
          prev.map((m) => (m.id === media.id ? { ...m, liked, status: 'archived' } : m))
        );
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to rate media. Please try again.',
        variant: 'destructive',
      });
    }
  };



  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-background/95">
      <TopNav />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl py-8 space-y-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Discover
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Explore the latest movies and TV shows, or search for your favorites.
            </p>
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </div>
          </div>

          {searchQuery ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">Search Results</h2>
              </div>
              {isSearching ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {searchResults.length > 0 ? (
                    searchResults.map((media) => (
                      <MediaCard
                        key={media.id}
                        media={media}
                        showAddButton
                        showLikeButtons
                        onRate={(liked) => handleRate(media, liked)}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No results found.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Trending Movies */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Trending Movies</h2>
                </div>
                {isLoadingTrendingMovies ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {trendingMovies.map((media) => (
                      <MediaCard
                        key={media.id}
                        media={media}
                        showAddButton
                        showLikeButtons
                        onRate={(liked) => handleRate(media, liked)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Trending TV Shows */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Trending TV Shows</h2>
                </div>
                {isLoadingTrendingTv ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {trendingTv.map((media) => (
                      <MediaCard
                        key={media.id}
                        media={media}
                        showAddButton
                        showLikeButtons
                        onRate={(liked) => handleRate(media, liked)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Movies */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">Upcoming Movies</h2>
                </div>
                {isLoadingUpcoming ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {upcomingMovies.map((media) => (
                      <MediaCard
                        key={media.id}
                        media={media}
                        showAddButton
                        showLikeButtons
                        onRate={(liked) => handleRate(media, liked)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
