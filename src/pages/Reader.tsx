import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchChapterPages, fetchMangaChapters, buildPageUrl } from "@/lib/mangadex";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, List, Home } from "lucide-react";

const Reader = () => {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isVertical, setIsVertical] = useState(false);

  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ["chapter-pages", chapterId],
    queryFn: () => fetchChapterPages(chapterId!),
    enabled: !!chapterId,
  });

  const { data: chaptersData } = useQuery({
    queryKey: ["chapters", id],
    queryFn: () => fetchMangaChapters(id!),
    enabled: !!id,
  });

  const currentChapterIndex = chaptersData?.chapters.findIndex(
    (ch) => ch.id === chapterId
  );

  const prevChapter =
    currentChapterIndex !== undefined && currentChapterIndex > 0
      ? chaptersData?.chapters[currentChapterIndex - 1]
      : null;

  const nextChapter =
    currentChapterIndex !== undefined &&
    chaptersData &&
    currentChapterIndex < chaptersData.chapters.length - 1
      ? chaptersData.chapters[currentChapterIndex + 1]
      : null;

  if (pagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!pages || pages.pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="border-4 border-destructive bg-destructive/10 p-8 text-center">
          <p className="font-pixel text-destructive text-sm mb-4">
            ERROR: CHAPTER NOT AVAILABLE
          </p>
          <Button
            onClick={() => navigate(`/manga/${id}`)}
            className="border-2 border-primary text-primary bg-primary/20 hover:bg-primary hover:text-background font-pixel text-xs"
          >
            <Home className="h-4 w-4 mr-2" />
            BACK TO DETAILS
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = pages.pages.length;
  const pageUrl = buildPageUrl(pages.baseUrl, pages.hash, pages.pages[currentPage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Controls */}
      <div className="border-b border-primary bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => navigate(`/manga/${id}`)}
              className="border-2 border-muted hover:border-primary bg-card text-foreground font-pixel text-xs px-3 py-2"
            >
              <List className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">CHAPTERS</span>
            </Button>

            {/* Toggle Reading Mode */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsVertical(false)}
                className={`border-2 font-pixel text-xs px-2 py-1 ${
                  !isVertical
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-muted text-muted"
                }`}
              >
                Horizontal
              </Button>
              <Button
                onClick={() => setIsVertical(true)}
                className={`border-2 font-pixel text-xs px-2 py-1 ${
                  isVertical
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-pink text-muted"
                }`}
              >
                Vertical
              </Button>
            </div>

            {/* Page Navigation (only in horizontal mode) */}
            {!isVertical && (
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="border-2 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-xs px-3 py-2 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="border-2 border-muted px-4 py-2 min-w-[120px] text-center">
                  <span className="font-pixel text-xs text-primary">
                    {currentPage + 1} / {totalPages}
                  </span>
                </div>

                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="border-2 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-xs px-3 py-2 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Page Display */}
      <div className="container mx-auto px-4 py-8">
        {isVertical ? (
          <div className="container mx-auto px-4 py-8 space-y-4 max-w-4xl">
            {pages.pages.map((page, idx) => (
              <img
                key={page}
                src={buildPageUrl(pages.baseUrl, pages.hash, page)}
                alt={`Page ${idx + 1}`}
                className="w-full h-auto border-4 border-secondary pixel-pulse bg-card"
                style={{ imageRendering: "pixelated" }}
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="border-4 border-secondary pixel-pulse max-w-4xl w-full bg-card">
              <img
                src={pageUrl}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chapter Navigation */}
      <div className="border-t border-primary bg-card/80 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between gap-4">
            {prevChapter ? (
              <Button
                onClick={() => {
                  navigate(`/manga/${id}/chapter/${prevChapter.id}`);
                  setCurrentPage(0);
                }}
                className="border-2 border-secondary bg-secondary/20 text-secondary hover:bg-secondary hover:text-background font-pixel text-xs px-4 py-2"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">PREV CHAPTER</span>
              </Button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <Button
                onClick={() => {
                  navigate(`/manga/${id}/chapter/${nextChapter.id}`);
                  setCurrentPage(0);
                }}
                className="border-2 border-accent bg-accent/20 text-accent hover:bg-accent hover:text-background font-pixel text-xs px-4 py-2"
              >
                <span className="hidden sm:inline">NEXT CHAPTER</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reader;
