import { useState, useMemo, useCallback } from 'react';

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author?: string;
  image_url?: string;
  image?: string;
  published_at?: string;
  date?: string;
  view_count?: number;
}

export const useBlogSearch = (posts: BlogPost[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const stripHtml = useCallback((html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      const excerpt = stripHtml(post.excerpt).toLowerCase();
      const content = post.content ? stripHtml(post.content).toLowerCase() : '';
      const category = post.category.toLowerCase();
      const author = (post.author || '').toLowerCase();

      return (
        title.includes(query) ||
        excerpt.includes(query) ||
        content.includes(query) ||
        category.includes(query) ||
        author.includes(query)
      );
    });
  }, [posts, searchQuery, stripHtml]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  };
};
