import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMangaList } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const MangaList = () => {
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ["manga-list", page],
    queryFn: () =>
      fetchMangaList({
        limit,
        offset: page * limit,
        order: { followedCount: "desc" },
      }),
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 border-4 border-primary p-4 bg-primary/10">
          <h1 className="text-3xl sm:text-4xl font-pixel text-primary pixel-glow">
            &gt;&gt; BROWSE MANGA
          </h1>
          <p className="text-xs sm:text-sm font-pixel text-muted-foreground mt-2">
            PAGE {page + 1} OF {totalPages}
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="border-4 border-destructive bg-destructive/10 p-8 text-center">
            <p className="font-pixel text-destructive text-sm">
              ERROR: FAILED TO LOAD MANGA
            </p>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {data.data.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4">
              <Button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="border-4 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                PREV
              </Button>

              <div className="border-2 border-muted px-6 py-3">
                <span className="font-pixel text-xs text-primary">
                  {page + 1} / {totalPages}
                </span>
              </div>

              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="border-4 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MangaList;
