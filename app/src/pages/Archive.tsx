import { TopNav } from '@/components/TopNav';
import { MediaCard } from '@/components/MediaCard';
import { useToast } from '@/hooks/useToast';
import { useMedia } from '@/hooks/useMedia';
import { Media } from '@/types';
import { deleteMedia, updateMedia } from '@/services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

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
    } catch (error) {
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
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Watched Archive</h1>

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
      </main>
    </div>
  );
};

export default Archive;
