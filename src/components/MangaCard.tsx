import { Link } from "react-router-dom";
import { Manga } from "@/lib/mangadex";

interface MangaCardProps {
  manga: Manga;
}

const MangaCard = ({ manga }: MangaCardProps) => {
  return (
    <Link
      to={`/manga/${manga.id}`}
      className="group block animate-fade-in"
    >
      <div className="border-4 border-muted hover:border-primary transition-all duration-300 bg-card overflow-hidden pixel-pulse">
        <div className="aspect-[3/4] overflow-hidden bg-muted/50">
          <img
            src={manga.coverUrl}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        <div className="p-3 space-y-2">
          <h3 className="font-pixel text-xs text-primary line-clamp-2 group-hover:rgb-glow">
            {manga.title}
          </h3>
          
          {manga.author && (
            <p className="text-[10px] text-muted-foreground">
              BY: {manga.author.toUpperCase()}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1">
            {manga.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[8px] px-2 py-1 border border-secondary text-secondary"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-[10px]">
            <span className={`px-2 py-1 border ${
              manga.status === 'ongoing' 
                ? 'border-accent text-accent' 
                : 'border-muted-foreground text-muted-foreground'
            }`}>
              {manga.status.toUpperCase()}
            </span>
            {manga.year && (
              <span className="text-muted-foreground">{manga.year}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
