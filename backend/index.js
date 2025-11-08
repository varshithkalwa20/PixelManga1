import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8081;

// Basic CORS
app.use(cors());

// Proxy middleware - handle all /api routes
app.use("/api", async (req, res) => {
  try {
    const mangadexUrl = `https://api.mangadex.dev${req.path}${req._parsedUrl.search || ''}`;
    
    console.log(`Proxying: ${req.method} ${mangadexUrl}`);
    
    const response = await fetch(mangadexUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `MangaDex API error: ${response.status}`
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ 
      error: "Proxy failed",
      message: error.message
    });
  }
});

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Catch-all handler (without problematic *)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});