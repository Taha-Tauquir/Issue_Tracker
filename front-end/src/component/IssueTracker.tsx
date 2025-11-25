import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Filter,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;



type IssueStatus = "open" | "in-progress" | "closed";

interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  created_at?: string;
  updated_at?: string;
}

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ size?: number }>;
}

const STATUS_CONFIG: Record<IssueStatus, StatusConfig> = {
  open: { label: "Open", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
};

interface FormData {
  title: string;
  description: string;
  status: IssueStatus;
}

const IssueTracker: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IssueStatus>("all");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "open",
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchQuery, statusFilter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/issues`);
      const data: Issue[] = await response.json();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    setFilteredIssues(filtered);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const url = editingIssue
        ? `${API_BASE}/issues/${editingIssue.id}`
        : `${API_BASE}/issues`;

      const method = editingIssue ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchIssues();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save issue:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    try {
      const response = await fetch(`${API_BASE}/issues/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchIssues();
      }
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  const openModal = (issue: Issue | null = null) => {
    if (issue) {
      setEditingIssue(issue);
      setFormData({
        title: issue.title,
        description: issue.description,
        status: issue.status,
      });
    } else {
      setEditingIssue(null);
      setFormData({ title: "", description: "", status: "open" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIssue(null);
    setFormData({ title: "", description: "", status: "open" });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStats = () => {
    return {
      total: issues.length,
      open: issues.filter((i) => i.status === "open").length,
      "in-progress": issues.filter((i) => i.status === "in-progress").length,
      closed: issues.filter((i) => i.status === "closed").length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Issue Tracker</h1>
              <p className="mt-1 text-slate-600">Manage and monitor project issues efficiently</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
            >
              <Plus size={20} />
              New Issue
            </button>
          </div>

          {/* Stats Dashboard */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="mt-1 text-sm text-slate-600">Total Issues</div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <div className="text-2xl font-bold text-blue-900">{stats.open}</div>
              <div className="mt-1 text-sm text-blue-700">Open</div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
              <div className="text-2xl font-bold text-yellow-900">{stats["in-progress"]}</div>
              <div className="mt-1 text-sm text-yellow-700">In Progress</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
              <div className="text-2xl font-bold text-green-900">{stats.closed}</div>
              <div className="mt-1 text-sm text-green-700">Closed</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[300px] flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search issues by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-10 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | IssueStatus)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-slate-400">
              <AlertCircle size={48} className="mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-900">No issues found</h3>
            <p className="text-slate-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first issue to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const statusConfig = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={issue.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          {issue.title}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-2 text-slate-600">
                        {issue.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {formatDate(issue.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{" "}
                          {formatDate(issue.updated_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(issue)}
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Edit issue"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete issue"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingIssue ? "Edit Issue" : "Create New Issue"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter issue title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the issue in detail"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as IssueStatus,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
                >
                  {editingIssue ? "Update Issue" : "Create Issue"}
                </button>
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;
