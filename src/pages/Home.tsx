import { useQuery } from "@tanstack/react-query";
import { fetchTrendingManga } from "@/lib/mangadex";
import MangaCard from "@/components/MangaCard";
import Navigation from "@/components/Navigation";
import { Loader2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Home = () => {
  const { data: trendingManga, isLoading, error } = useQuery({
    queryKey: ["trending-manga"],
    queryFn: () => fetchTrendingManga(20),
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative border-b-4 border-primary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(${heroBanner})`,
            imageRendering: 'pixelated'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-pixel text-primary rgb-glow mb-6 animate-pixel-float">
            PixelManga
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-pixel text-secondary mb-8 max-w-2xl mx-auto">
            &gt; A pixel path to manga heaven.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/manga"
              className="px-8 py-4 border-4 border-primary bg-primary/20 text-primary font-pixel text-xs hover:bg-primary hover:text-background transition-all pixel-pulse"
            >
              START READING
            </a>
            <a
              href="/search"
              className="px-8 py-4 border-4 border-secondary bg-secondary/20 text-secondary font-pixel text-xs hover:bg-secondary hover:text-background transition-all pixel-pulse"
            >
              SEARCH MANGA
            </a>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 border-4 border-accent p-4 bg-accent/10">
          <h2 className="text-2xl sm:text-3xl font-pixel text-accent pixel-glow">
            &gt;&gt; TRENDING NOW
          </h2>
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

        {trendingManga && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
