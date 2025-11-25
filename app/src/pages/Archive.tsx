import { TopNav } from "@/components/TopNav";
import { MediaCard, Media } from "@/components/MediaCard";
import { useToast } from "@/hooks/use-toast";
import { useMedia } from "@/hooks/useMedia";

const Archive = () => {
  const { items, isLoading, refetch } = useMedia("archived");
  const { toast } = useToast();

  const handleRemove = async (id: number) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to remove from archive");

      toast({
        title: "Removed from archive",
        description: "Item has been removed from your archive.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from archive. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleLike = async (item: Media) => {
    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          liked: !item.liked,
          status: item.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to update like status");

      toast({
        title: "Updated",
        description: `Like status updated for ${item.title}.`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
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
          <div className="text-center text-muted-foreground">
            Your archive is empty
          </div>
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
                onLike={() => handleToggleLike(item)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;
