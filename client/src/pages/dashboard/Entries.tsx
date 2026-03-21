import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/api/axios";
import useDebounce from "@/hooks/useDebounce";
import { TableSkeleton } from "@/components/skeletons";
import Empty from "@/components/Empty";
import { toast } from "sonner";
import DeleteDialog from "@/components/DeleteDialog";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Entry {
  _id: string;
  title: string;
  plainText: string;
  createdAt: string;
  meta: { wordCount: number; readingTime: number };
  ai: {
    topics: string[];
    mood: { label: string; emoji: string; score: number };
  };
}

interface EntriesResponse {
  entries: Entry[];
  total: number;
  page: number;
  totalPages: number;
}

const Entries = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["entries", page, limit, debouncedSearch],
    queryFn: async () => {
      const res = await api.get<EntriesResponse>("/entries", {
        params: { page, limit, search: debouncedSearch },
      });
      return res.data;
    },
  });

  const { mutate: remove, isPending: deleting } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/entries/${id}`);
    },
    onSuccess: () => {
      toast.success("Entry deleted!");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: () => toast.error("Failed to delete entry"),
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 md:mb-6">
        <h1 className="text-2xl md:text-3xl text-text">My Entries</h1>
        <button
          onClick={() => navigate("/entries/new")}
          className="bg-accent text-bg px-3 md:px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + New Entry
        </button>
      </div>

      {/* Search + Limit */}
      <div className="flex gap-2 md:gap-3 mb-5 md:mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search entries..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-surface border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
          />
        </div>
        <select
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
          className="bg-surface border border-border rounded-lg px-2 md:px-3 py-2.5 text-sm text-muted outline-none cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && <TableSkeleton rows={5} />}

      {/* Empty */}
      {!isLoading && data?.entries.length === 0 && (
        <Empty
          title={search ? "No results found" : "No entries yet"}
          description={search ? `Nothing matched "${search}"` : "Start writing your first journal entry!"}
          action={search ? undefined : "+ New Entry"}
          onAction={search ? undefined : () => navigate("/entries/new")}
        />
      )}

      {/* Entries List */}
      <div className="flex flex-col gap-3 mb-6">
        {data?.entries.map((entry) => (
          <div
            key={entry._id}
            className="bg-surface border border-border rounded-xl p-4 md:p-5 hover:bg-surface2 transition-colors"
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <h2
                className="text-text font-medium cursor-pointer hover:text-accent transition-colors flex-1 min-w-0 truncate"
                onClick={() => navigate(`/entries/${entry._id}`)}
              >
                {entry.ai?.mood?.emoji} {entry.title}
              </h2>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(entry._id); }}
                className="text-muted hover:text-danger transition-colors cursor-pointer flex-shrink-0 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="text-sm text-muted line-clamp-2 mb-3">
              {entry.plainText}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs text-muted">
              <span>{new Date(entry.createdAt).toDateString()}</span>
              <span>{entry.meta?.wordCount} words</span>
              <span className="hidden sm:inline">{entry.meta?.readingTime} min read</span>
              {entry.ai?.mood && <span>{entry.ai.mood.emoji} {entry.ai.mood.label}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total} entries
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-surface border border-border rounded-lg text-muted disabled:opacity-50 cursor-pointer hover:bg-surface2 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {/* Show max 5 page buttons on mobile */}
            {Array.from({ length: data.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === data.totalPages || Math.abs(p - page) <= 1)
              .map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span key={`dots-${p}`} className="px-2 py-1.5 text-muted text-sm">...</span>
                  )}
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                      p === page
                        ? "bg-accent text-bg font-semibold"
                        : "bg-surface border border-border text-muted hover:bg-surface2"
                    }`}
                  >
                    {p}
                  </button>
                </>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="p-2 bg-surface border border-border rounded-lg text-muted disabled:opacity-50 cursor-pointer hover:bg-surface2 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        isPending={deleting}
      />
    </div>
  );
};

export default Entries;