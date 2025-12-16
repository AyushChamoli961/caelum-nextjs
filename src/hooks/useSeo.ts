"use client";

import { useState, useEffect } from "react";

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useSeo(slug: string) {
  const [seo, setSeo] = useState<SeoData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const response = await fetch(`/api/seo/${encodeURIComponent(slug)}`);
        if (response.ok) {
          const data = await response.json();
          setSeo(data.result);
        }
      } catch (error) {
        console.error("Failed to fetch SEO data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeo();
  }, [slug]);

  return { seo, isLoading };
}
