import { Archive, Plus, Star, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { useToast } from '../hooks/useToast';
import { addMedia } from '../services/api';
import { Media } from '../types';
import { formatDate } from '../utils/date';
import { Button } from './ui/button';

interface MediaCardProps {
  media: Media;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  showLikeButtons?: boolean;
  showArchiveButton?: boolean;
  onRemove?: () => void;
  onRate?: (liked: boolean) => void;
  onArchive?: () => void;
}

export const MediaCard = ({
  media,
  showAddButton = false,
  showRemoveButton = false,
  showLikeButtons = false,
  showArchiveButton = false,
  onRemove,
  onRate,
  onArchive,
}: MediaCardProps) => {
  const { toast } = useToast();

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
        status: 'watchlist',
      });

      toast({
        title: SUCCESS_MESSAGES.ADDED_TO_WATCHLIST,
        description: `${media.title} has been added to your watchlist.`,
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: ERROR_MESSAGES.ADD_TO_WATCHLIST_FAILED,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
      <img
        src={media.poster}
        alt={media.title}
        className="h-40 w-28 rounded object-cover shadow-md"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <h3 className="font-semibold text-card-foreground">{media.title}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {media.type} • {media.year}
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {media.description}
        </p>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p>Release: {formatDate(media.releaseDate)}</p>
          {media.createdAt && <p>Added: {formatDate(media.createdAt)}</p>}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-medium text-card-foreground">{media.rating}</span>
          </div>
          <div className="flex gap-1">
            {showAddButton && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddToWatchlist}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            )}
            {showLikeButtons && (
              <>
                <Button
                  size="sm"
                  variant={media.liked === true ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRate?.(true);
                  }}
                  className="h-7 gap-1 px-2 text-xs"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={media.liked === false ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRate?.(false);
                  }}
                  className="h-7 gap-1 px-2 text-xs"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
            {showArchiveButton && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onArchive?.();
                }}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Archive className="h-3 w-3" />
                Archive
              </Button>
            )}
            {showRemoveButton && (
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove?.();
                }}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
