import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

import { MediaCard } from '../components/MediaCard';
import { TopNav } from '../components/TopNav';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Button } from '../components/ui/button';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { useMedia } from '../hooks/useMedia';
import { useToast } from '../hooks/useToast';
import { deleteMedia, updateMedia } from '../services/api';
import { Media } from '../types';

const Watchlist = () => {
  const { items, isLoading, refetch } = useMedia('watchlist');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const { toast } = useToast();

  const handleRemove = async (id: number) => {
    try {
      await deleteMedia(id);

      toast({
        title: 'Removed from watchlist',
        description: 'Item has been removed from your watchlist.',
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

  const handleArchiveClick = (item: Media) => {
    setSelectedItem(item);
    setArchiveDialogOpen(true);
  };

  const handleArchive = async (liked: boolean) => {
    if (!selectedItem) return;

    try {
      await updateMedia(selectedItem.id, {
        liked,
        status: 'archived',
      });

      toast({
        title: SUCCESS_MESSAGES.ARCHIVED,
        description: `${selectedItem.title} has been archived.`,
      });

      setArchiveDialogOpen(false);
      setSelectedItem(null);
      refetch();
    } catch (_error) {
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.ARCHIVE_FAILED,
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
              Watchlist
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Keep track of movies and TV shows you want to watch.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground">Your watchlist is empty</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  showAddButton={false}
                  showRemoveButton={true}
                  showArchiveButton={true}
                  onRemove={() => handleRemove(item.id)}
                  onArchive={() => handleArchiveClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedItem?.title}?</AlertDialogTitle>
            <AlertDialogDescription>Did you like this {selectedItem?.type}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => handleArchive(false)} variant="outline" className="gap-2">
              <ThumbsDown className="h-4 w-4" />
              Disliked
            </Button>
            <Button onClick={() => handleArchive(true)} className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              Liked
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Watchlist;
