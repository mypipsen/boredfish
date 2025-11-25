import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { MediaCard, Media } from "@/components/MediaCard";
import { useToast } from "@/hooks/use-toast";
import { useMedia } from "@/hooks/useMedia";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Watchlist = () => {
  const { items, isLoading, refetch } = useMedia("watchlist");
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const { toast } = useToast();

  const handleRemove = async (id: number) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to remove from watchlist");

      toast({
        title: "Removed from watchlist",
        description: "Item has been removed from your watchlist.",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist. Please try again.",
        variant: "destructive",
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
      const response = await fetch(`/api/media/${selectedItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          liked,
          status: "archived",
        }),
      });

      if (!response.ok) throw new Error("Failed to archive item");

      toast({
        title: "Archived",
        description: `${selectedItem.title} has been archived.`,
      });

      setArchiveDialogOpen(false);
      setSelectedItem(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">My Watchlist</h1>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Your watchlist is empty
          </div>
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
      </main>

      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selectedItem?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              Did you like this {selectedItem?.type}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => handleArchive(false)}
              variant="outline"
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Disliked
            </Button>
            <Button
              onClick={() => handleArchive(true)}
              className="gap-2"
            >
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
