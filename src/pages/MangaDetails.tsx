import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMangaDetails, fetchMangaChapters } from "@/lib/mangadex";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Calendar, User } from "lucide-react";

const MangaDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: manga, isLoading: mangaLoading } = useQuery({
    queryKey: ["manga", id],
    queryFn: () => fetchMangaDetails(id!),
    enabled: !!id,
  });

  const { data: chaptersData, isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", id],
    queryFn: () => fetchMangaChapters(id!),
    enabled: !!id,
  });

  if (mangaLoading || chaptersLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="border-4 border-destructive bg-destructive/10 p-8 text-center">
            <p className="font-pixel text-destructive text-sm">
              ERROR: MANGA NOT FOUND
            </p>
          </div>
        </div>
      </div>
    );
  }

  const firstChapter = chaptersData?.chapters[0];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <div className="md:col-span-1">
            <div className="border-4 border-primary pixel-pulse bg-card overflow-hidden sticky top-24">
              <img
                src={manga.coverUrl}
                alt={manga.title}
                className="w-full aspect-[3/4] object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="border-4 border-accent p-6 bg-accent/10">
              <h1 className="text-2xl sm:text-4xl font-pixel text-accent pixel-glow mb-4">
                {manga.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs font-pixel mb-6">
                {manga.author && (
                  <div className="flex items-center gap-2 text-secondary">
                    <User className="h-4 w-4" />
                    <span>{manga.author}</span>
                  </div>
                )}
                {manga.year && (
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>{manga.year}</span>
                  </div>
                )}
                <div className={`px-3 py-1 border-2 ${
                  manga.status === 'ongoing' 
                    ? 'border-accent text-accent' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {manga.status.toUpperCase()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {manga.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 border-2 border-secondary text-secondary"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="border-t-2 border-muted pt-4">
                <p className="text-xs leading-relaxed text-foreground/80">
                  {manga.description}
                </p>
              </div>
            </div>

            {firstChapter && (
              <Link to={`/manga/${id}/chapter/${firstChapter.id}`}>
                <Button className="w-full border-4 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-sm py-6 pixel-pulse">
                  <BookOpen className="h-5 w-5 mr-2" />
                  START READING
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Chapters List */}
        <div className="border-4 border-secondary p-6 bg-secondary/10">
          <h2 className="text-2xl font-pixel text-secondary pixel-glow mb-6">
            &gt;&gt; CHAPTERS
          </h2>

          {chaptersData && chaptersData.chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {chaptersData.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/manga/${id}/chapter/${chapter.id}`}
                  className="border-2 border-muted hover:border-primary bg-card/50 p-4 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-pixel text-xs text-primary group-hover:pixel-glow">
                      CH. {chapter.chapter}
                    </span>
                    {chapter.pages > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {chapter.pages} PGS
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-foreground/60 line-clamp-2">
                    {chapter.title}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm font-pixel text-muted-foreground text-center py-8">
              NO CHAPTERS AVAILABLE
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
