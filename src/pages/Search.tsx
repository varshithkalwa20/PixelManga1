import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMangaList } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["search-manga", activeSearch],
    queryFn: () =>
      fetchMangaList({
        title: activeSearch,
        limit: 20,
      }),
    enabled: activeSearch.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 border-4 border-accent p-6 bg-accent/10">
          <h1 className="text-3xl sm:text-4xl font-pixel text-accent pixel-glow mb-6">
            &gt;&gt; SEARCH MANGA
          </h1>

          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              type="text"
              placeholder="ENTER MANGA TITLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-4 border-primary bg-input text-foreground font-pixel text-xs placeholder:text-muted-foreground focus:border-primary focus:ring-0 px-4 py-6"
            />
            <Button
              type="submit"
              className="border-4 border-primary bg-primary/20 text-primary hover:bg-primary hover:text-background font-pixel text-xs px-6 pixel-pulse"
            >
              <SearchIcon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">SEARCH</span>
            </Button>
          </form>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!activeSearch && !isLoading && (
          <div className="border-4 border-muted bg-muted/10 p-12 text-center">
            <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="font-pixel text-sm text-muted-foreground">
              ENTER A SEARCH TERM TO BEGIN
            </p>
          </div>
        )}

        {activeSearch && !isLoading && data && (
          <>
            <div className="mb-6 border-2 border-secondary p-4 bg-secondary/10">
              <p className="font-pixel text-xs text-secondary">
                FOUND {data.total} RESULTS FOR "{activeSearch}"
              </p>
            </div>

            {data.data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data.data.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            ) : (
              <div className="border-4 border-muted bg-muted/10 p-12 text-center">
                <p className="font-pixel text-sm text-muted-foreground">
                  NO RESULTS FOUND
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
