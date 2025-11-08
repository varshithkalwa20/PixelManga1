
const BASE_URL = 'http://localhost:8081/api';


export interface Manga {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  status: string;
  tags: string[];
  author?: string;
  year?: number;
}

export interface Chapter {
  id: string;
  title: string;
  chapter: string;
  volume?: string;
  pages: number;
  translatedLanguage: string;
  publishAt: string;
  externalUrl?: string;
}

export interface ChapterPages {
  baseUrl: string;
  hash: string;
  pages: string[];
}

// Fetch manga list with optional filters
export async function fetchMangaList(params: {
  limit?: number;
  offset?: number;
  title?: string;
  includedTags?: string[];
  order?: Record<string, 'asc' | 'desc'>;
} = {}): Promise<{ data: Manga[]; total: number }> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());
  if (params.title) searchParams.append('title', params.title);
  if (params.includedTags) {
    params.includedTags.forEach(tag => searchParams.append('includedTags[]', tag));
  }
  if (params.order) {
    Object.entries(params.order).forEach(([key, value]) => {
      searchParams.append(`order[${key}]`, value);
    });
  }

  searchParams.append('includes[]', 'cover_art');  // documented relationship
  searchParams.append('includes[]', 'author');

  try {
    const response = await fetch(`${BASE_URL}/manga?${searchParams}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const json = await response.json();
    const mangaList = json.data.map((item: any) => parseManga(item));
    return {
      data: mangaList,
      total: json.total || mangaList.length,
    };
  } catch (error) {
    console.error('Error fetching manga list:', error);
    throw error;
  }
}

// Fetch trending manga (most followed)
export async function fetchTrendingManga(limit: number = 20): Promise<Manga[]> {
  const result = await fetchMangaList({
    limit,
    order: { followedCount: 'desc' },
  });
  return result.data;
}

// Fetch manga details by ID
export async function fetchMangaDetails(mangaId: string): Promise<Manga> {
  try {
    const response = await fetch(
      `${BASE_URL}/manga/${mangaId}?includes[]=cover_art&includes[]=author`
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const json = await response.json();
    return parseManga(json.data);
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw error;
  }
}

// Fetch chapters for a manga, optional language filter, supports pagination for all chapters
export async function fetchMangaChapters(
  mangaId: string,
  language: string = 'en'
): Promise<{ chapters: Chapter[]; total: number }> {
  const limit = 100;
  let offset = 0;
  let chapters: Chapter[] = [];
  let total = 0;

  do {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    if (language) params.append('translatedLanguage[]', language);
    params.append('order[chapter]', 'asc');
    params.append('contentRating[]', 'safe');
    params.append('contentRating[]', 'suggestive');
    params.append('contentRating[]', 'erotica');
    params.append('contentRating[]', 'pornographic');
    params.append('includeFutureUpdates', '1');
    params.append('includeUnavailable', '1');

    const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?${params}`);
    const json = await response.json();
    if (!json.data) break;

    chapters = chapters.concat(
      json.data.map((item: any) => ({
        id: item.id,
        title: item.attributes.title || `Chapter ${item.attributes.chapter}`,
        chapter: item.attributes.chapter || 'N/A',
        volume: item.attributes.volume,
        pages: item.attributes.pages || 0,
        translatedLanguage: item.attributes.translatedLanguage,
        publishAt: item.attributes.publishAt,
        externalUrl: item.attributes.externalUrl,
        isUnavailable: item.attributes.isUnavailable || false,
      }))
    );

    total = json.total || chapters.length;
    offset += limit;
  } while (chapters.length < total);

   
  // FILTER: Only include chapters that are readable (either have pages OR external URL)
  const readableChapters = chapters.filter(chapter => 
    chapter.pages > 0 || chapter.externalUrl
  );

  // Deduplicate chapters based on volume+chapter combination
  const uniqueChapters = Array.from(
    new Map(
      readableChapters.map(chapter => [
        `${chapter.volume ?? ''}-${chapter.chapter}`,
        chapter,
      ])
    ).values()
  );

  return { chapters: uniqueChapters, total: uniqueChapters.length };
}


// Fetch chapter pages - UPDATED TO HANDLE EXTERNAL CHAPTERS
export async function fetchChapterPages(chapterId: string, externalUrl?: string): Promise<ChapterPages> {
  try {
    const response = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const json = await response.json();
    
    // Use data-saver if regular data is empty
    const pages = json.chapter.data && json.chapter.data.length > 0 
      ? json.chapter.data 
      : json.chapter.dataSaver || [];
    
    if (pages.length === 0) {
      throw new Error('No pages available for this chapter');
    }
    
    return {
      baseUrl: json.baseUrl,
      hash: json.chapter.hash,
      pages: pages,
    };
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
}
export function shouldRedirectToExternal(chapter: Chapter): boolean {
  return !!chapter.externalUrl && chapter.pages === 0;
}

// NEW FUNCTION: Get external URL for redirect
export function getExternalChapterUrl(chapter: Chapter): string {
  return chapter.externalUrl!;
}
// When user clicks on a chapter
async function handleChapterClick(chapter: Chapter) {
  // Check if this chapter should redirect to external site
  if (shouldRedirectToExternal(chapter)) {
    // Redirect to the external URL
    window.open(getExternalChapterUrl(chapter), '_blank');
    return;
  }
  
  // Otherwise, try to load from MangaDex
  try {
    const pages = await fetchChapterPages(chapter.id);
    // Display the pages in your reader
    displayChapter(pages);
  } catch (error) {
    console.error('Failed to load chapter:', error);
  }
}
// Fetch chapter pages

// Add this function to your existing code
function displayChapter(pages: ChapterPages) {
  // Implementation depends on your UI framework
  // Here's a vanilla JS example:
  const reader = document.getElementById('manga-reader');
  if (!reader) return;
  
  reader.innerHTML = '';
  
  pages.pages.forEach((page, index) => {
    const img = document.createElement('img');
    img.src = buildPageUrl(pages.baseUrl, pages.hash, page);
    img.alt = `Page ${index + 1}`;
    img.className = 'w-full mb-4';
    reader.appendChild(img);
  });
}
// Helper function to parse manga data
function parseManga(data: any): Manga {
  const attributes = data.attributes;
  const relationships = data.relationships || [];

  const coverRel = relationships.find((rel: any) => rel.type === 'cover_art');
  const coverFileName = coverRel?.attributes?.fileName;
  const coverUrl = coverFileName
    ? `https://uploads.mangadex.org/covers/${data.id}/${coverFileName}.256.jpg`
    : '/placeholder.svg';

  const authorRel = relationships.find((rel: any) => rel.type === 'author');
  const author = authorRel?.attributes?.name;

  const title =
    attributes.title?.en ||
    attributes.title?.[Object.keys(attributes.title)[0]] ||
    'Unknown Title';

  const description =
    attributes.description?.en ||
    attributes.description?.[Object.keys(attributes.description || {})[0]] ||
    'No description available.';

  const tags = (attributes.tags || [])
    .slice(0, 5)
    .map((tag: any) => tag.attributes?.name?.en || 'Unknown tag');

  return {
    id: data.id,
    title,
    description,
    coverUrl,
    status: attributes.status || 'unknown',
    tags,
    author,
    year: attributes.year,
  };
}

// Build page URL
export function buildPageUrl(baseUrl: string, hash: string, page: string): string {
  return `${baseUrl}/data/${hash}/${page}`;
}
