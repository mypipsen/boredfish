import { MediaCard } from '../components/MediaCard';
import { TopNav } from '../components/TopNav';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { useMedia } from '../hooks/useMedia';
import { useToast } from '../hooks/useToast';
import { deleteMedia, updateMedia } from '../services/api';
import { Media } from '../types';

const Archive = () => {
  const { items, isLoading, refetch } = useMedia('archived');
  const { toast } = useToast();

  const handleRemove = async (id: number) => {
    try {
      await deleteMedia(id);

      toast({
        title: 'Removed from archive',
        description: 'Item has been removed from your archive.',
      });

      refetch();
    } catch (_error) {
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.REMOVE_FAILED,
        variant: 'destructive',
      });
    }
  };

  const handleToggleLike = async (item: Media) => {
    try {
      await updateMedia(item.id, {
        liked: !item.liked,
        status: item.status,
      });

      toast({
        title: SUCCESS_MESSAGES.UPDATED,
        description: `Like status updated for ${item.title}.`,
      });

      refetch();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.UPDATE_FAILED,
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
              Archive
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              History of movies and TV shows you've watched.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground">Your archive is empty</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  showAddButton={false}
                  showRemoveButton={true}
                  showLikeButtons={true}
                  onRemove={() => handleRemove(item.id)}
                  onRate={() => handleToggleLike(item)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Archive;
