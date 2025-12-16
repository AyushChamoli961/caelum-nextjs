"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { MdArrowBack, MdSave } from "react-icons/md";

export default function NewSeoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    schemaMarkup: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create SEO page");
      }

      router.push("/admin/seo");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create SEO page"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/seo">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">New SEO Page</h1>
            </div>
            <Button
              type="submit"
              form="seo-form"
              isLoading={loading}
              className="flex items-center gap-2"
            >
              <MdSave size={20} />
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form id="seo-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">
              Page Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Page Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g., /about-us or /services/web-development"
                required
              />
              <Input
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="Page title for search engines"
                required
              />
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="Brief description (150-160 characters)"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                />
              </div>
              <Input
                label="Meta Keywords"
                value={formData.metaKeywords}
                onChange={(e) =>
                  setFormData({ ...formData, metaKeywords: e.target.value })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
              <Input
                label="Canonical URL"
                value={formData.canonicalUrl}
                onChange={(e) =>
                  setFormData({ ...formData, canonicalUrl: e.target.value })
                }
                placeholder="https://example.com/page"
              />
            </div>
          </Card>

          {/* Open Graph */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">
              Open Graph (Social Sharing)
            </h2>
            <div className="space-y-4">
              <Input
                label="OG Title"
                value={formData.ogTitle}
                onChange={(e) =>
                  setFormData({ ...formData, ogTitle: e.target.value })
                }
                placeholder="Title for social sharing"
              />
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  OG Description
                </label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, ogDescription: e.target.value })
                  }
                  placeholder="Description for social sharing"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                />
              </div>
              <Input
                label="OG Image URL"
                value={formData.ogImage}
                onChange={(e) =>
                  setFormData({ ...formData, ogImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </Card>

          {/* Schema Markup */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">
              Schema Markup
            </h2>
            <div>
              <label className="block text-sm font-medium text-color3 mb-2">
                JSON-LD Schema
              </label>
              <textarea
                value={formData.schemaMarkup}
                onChange={(e) =>
                  setFormData({ ...formData, schemaMarkup: e.target.value })
                }
                placeholder='{"@context": "https://schema.org", ...}'
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1 font-mono text-sm"
              />
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">Page Content</h2>
            <div>
              <label className="block text-sm font-medium text-color3 mb-2">
                Content (HTML)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Page content (HTML supported)"
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
              />
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
