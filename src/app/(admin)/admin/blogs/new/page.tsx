"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Select } from "@/components/ui";
import { MdArrowBack, MdSave, MdPreview } from "react-icons/md";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    readTime: "",
    isPublished: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: formData.slug || generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          readTime: formData.readTime ? parseInt(formData.readTime) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create blog");
      }

      router.push("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
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
              <Link href="/admin/blogs">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">New Blog Post</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                form="blog-form"
                isLoading={loading}
                className="flex items-center gap-2"
              >
                <MdSave size={20} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter blog title"
                required
              />
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="enter-blog-slug"
                required
              />
              <div>
                <label className="block text-sm font-medium text-color3 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your blog content here... (HTML supported)"
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color1"
                  required
                />
              </div>
              <Input
                label="Read Time (minutes)"
                type="number"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: e.target.value })
                }
                placeholder="5"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 text-color1 border-gray-300 rounded focus:ring-color1"
                />
                <label htmlFor="isPublished" className="text-sm text-color3">
                  Publish immediately
                </label>
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-color3 mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="SEO title (defaults to blog title)"
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
                  placeholder="Brief description for search engines (150-160 characters)"
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
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
