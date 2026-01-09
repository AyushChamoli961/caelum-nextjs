"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdArrowBack, MdSearch, MdRefresh } from "react-icons/md";
import { Card, Button } from "@/components/ui";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  createdAt: string;
  verified: boolean;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), search });
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.result) {
        setLeads(data.result.leads || []);
        setPagination(data.result.pagination);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-color6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <MdArrowBack size={20} />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-color3">
                Manage Leads
              </h1>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLeads()}
              className="flex items-center gap-2"
            >
              <MdRefresh size={18} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-6 max-w-md"
        >
          <div className="relative flex-1">
            <MdSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color1 focus:outline-none"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Table */}
        {loading ? (
          <Card className="p-8 text-center text-gray-500">Loading leads...</Card>
        ) : leads.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No leads found
          </Card>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Location
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3">{lead.name}</td>
                    <td className="px-6 py-3">{lead.email}</td>
                    <td className="px-6 py-3">{lead.phone}</td>
                    <td className="px-6 py-3">
                      {lead.city}, {lead.state}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
