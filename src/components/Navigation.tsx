import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Search } from "lucide-react";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="border-b-4 border-primary bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="PixelManga Logo" 
              className="h-12 w-12 pixel-pulse"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-2xl font-pixel text-primary rgb-glow hidden sm:inline">
              PixelManga
            </span>
          </Link>
          
          <div className="flex gap-2 sm:gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 border-2 transition-all ${
                isActive("/")
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-muted hover:border-primary hover:bg-primary/10"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-pixel hidden sm:inline">HOME</span>
            </Link>
            
            <Link
              to="/manga"
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 border-2 transition-all ${
                isActive("/manga")
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-muted hover:border-primary hover:bg-primary/10"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-pixel hidden sm:inline">BROWSE</span>
            </Link>
            
            <Link
              to="/search"
              className={`flex items-center gap-2 px-3 sm:px-6 py-3 border-2 transition-all ${
                isActive("/search")
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-muted hover:border-primary hover:bg-primary/10"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-pixel hidden sm:inline">SEARCH</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
