import { useState, useMemo } from "react";
import { Search, Plus, Calendar, Clock, User, Edit2, Trash2, Video, SlidersHorizontal, X } from "lucide-react";
import SessionFormModal from "../../components/SessionFormModal";

const initialSessions = [
    {
        id: "SES-1001",
        sessionName: "React Fundamentals",
        trainerName: "Priya Sharma",
        date: "2026-07-09",
        time: "10:00",
        duration: "90 minutes",
        description: "Intro to components, props, and state.",
    },
    {
        id: "SES-1002",
        sessionName: "Advanced Node.js",
        trainerName: "Arjun Mehta",
        date: "2026-07-09",
        time: "14:00",
        duration: "60 minutes",
        description: "Streams, clustering, and performance tuning.",
    },
    {
        id: "SES-1003",
        sessionName: "UI/UX Design Principles",
        trainerName: "Kavya Reddy",
        date: "2026-07-12",
        time: "11:30",
        duration: "120 minutes",
        description: "Design systems and accessibility basics.",
    },
    {
        id: "SES-1004",
        sessionName: "Intro to Cloud Computing",
        trainerName: "Rohan Iyer",
        date: "2026-07-02",
        time: "09:00",
        duration: "75 minutes",
        description: "Core AWS services and deployment models.",
    },
];

const getSessionStatus = (session) => {
    const start = new Date(`${session.date}T${session.time || "00:00"}`);
    if (isNaN(start.getTime())) return "Upcoming";

    const durationMinutes = parseInt(session.duration, 10) || 60;
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const now = new Date();

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Live";
    return "Completed";
}

const statusConfig = {
    Upcoming: { dot: "bg-[#B45309]", badgeText: "text-[#3F3A35]", borderColor: "#B45309" },
    Live: { dot: "bg-[#B91C1C]", badgeText: "text-[#3F3A35]", borderColor: "#B91C1C" },
    Completed: { dot: "bg-[#9CA3AF]", badgeText: "text-[#6B6660]", borderColor: "#9CA3AF" },
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

const nextSessionId = (sessions) => {
    const maxNum = sessions.reduce((max, s) => {
        const num = parseInt(String(s.id).replace(/\D/g, ""), 10);
        return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 1000);
    return `SES-${maxNum + 1}`;
}

const SessionManagement = () => {

    const [sessions, setSessions] = useState(initialSessions);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [joiningSession, setJoiningSession] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredSessions = useMemo(() => {
        return sessions
        .map((s) => ({ ...s, status: getSessionStatus(s) }))
        .filter((s) => {
            const matchesSearch = s.sessionName
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
            const matchesStatus = statusFilter === "All" || s.status === statusFilter;
            const matchesDate = !dateFilter || s.date === dateFilter;
            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    }, [sessions, searchTerm, statusFilter, dateFilter]);

    const hasActiveFilters = searchTerm || statusFilter !== "All" || dateFilter;

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDateFilter("");
    };

    const openAddModal = () => {
        setEditingSession(null);
        setIsModalOpen(true);
    };

    const openEditModal = (session) => {
        setEditingSession(session);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
    };

    const handleSave = (formData) => {
        if (editingSession) {
            setSessions((prev) =>
                prev.map((s) => (s.id === editingSession.id ? { ...s, ...formData } : s))
            );
        } else {
            const newSession = { id: nextSessionId(sessions), ...formData };
            setSessions((prev) => [...prev, newSession]);
        }
        closeModal();
    };

    const confirmDelete = (session) => setDeleteTarget(session);

    const handleDelete = () => {
        setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const handleJoin = (session) => {
        setJoiningSession(session);
        setTimeout(() => setJoiningSession(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7]">
        {/* Header */}
            <div className="border-b border-[#E7E2DC] bg-white px-4 py-6 sm:px-8">
                <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1C1917]">Session Management</h1>
                        <p className="mt-1 text-sm text-[#6B6660]">
                        View, schedule, and manage all training sessions.
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-md bg-[#7B2C2C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#651F1F]"
                    >
                        <Plus size={18} />
                        Add New Session
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
                <div className="mb-6 flex flex-col gap-3 rounded-lg border border-[#E7E2DC] bg-white p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                        <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by session name..."
                        className="w-full rounded-md border border-[#E7E2DC] py-2 pl-9 pr-3 text-sm text-[#1C1917] outline-none transition placeholder:text-[#A8A29E] focus:border-[#7B2C2C] focus:ring-1 focus:ring-[#7B2C2C]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={15} className="hidden text-[#A8A29E] sm:block" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-md border border-[#E7E2DC] bg-white px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#7B2C2C] focus:ring-1 focus:ring-[#7B2C2C]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Live">Live</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={15} className="hidden text-[#A8A29E] sm:block" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="rounded-md border border-[#E7E2DC] bg-white px-3 py-2 text-sm text-[#1C1917] outline-none transition focus:border-[#7B2C2C] focus:ring-1 focus:ring-[#7B2C2C]"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-[#7B2C2C] hover:text-[#651F1F]"
                        >
                        <X size={14} />
                        Clear
                        </button>
                    )}
                </div>

                <p className="mb-3 text-sm text-[#8A8580]">
                    {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""} found
                </p>

                {filteredSessions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#E7E2DC] bg-white py-16 text-center">
                    <p className="text-[#8A8580]">No sessions match your search or filters.</p>
                </div>
                    ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredSessions.map((session) => {
                    const cfg = statusConfig[session.status];
                    return (
                        <div
                            key={session.id}
                            className="flex flex-col rounded-lg border border-[#E7E2DC] bg-white shadow-sm transition hover:shadow-md"
                            style={{ borderLeftWidth: "3px", borderLeftColor: cfg.borderColor }}
                        >
                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-medium uppercase tracking-wide text-[#A8A29E]">
                                        {session.id}
                                    </span>
                                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.badgeText}`}>
                                        <span className={`relative flex h-1.5 w-1.5 ${cfg.dot} rounded-full`}>
                                        {session.status === "Live" && (
                                            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-75`} />
                                        )}
                                        </span>
                                        {session.status}
                                    </span>
                                </div>

                                <h3 className="mb-1 text-base font-semibold leading-snug text-[#1C1917]">
                                    {session.sessionName}
                                </h3>

                                <div className="mb-4 flex items-center gap-1.5 text-sm text-[#6B6660]">
                                    <User size={14} />
                                    <span>{session.trainerName}</span>
                                </div>

                                <div className="mb-4 space-y-1.5 text-sm text-[#3F3A35]">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#A8A29E]" />
                                        <span>{formatDate(session.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-[#A8A29E]" />
                                        <span>
                                        {formatTime(session.time)} · {session.duration}
                                        </span>
                                    </div>
                                </div>

                                {session.description && (
                                    <p className="mb-4 line-clamp-2 text-sm text-[#6B6660]">{session.description}</p>
                                )}

                                <div className="mt-auto flex items-center gap-2 border-t border-[#F0EDE8] pt-4">
                                    <button
                                        onClick={() => handleJoin(session)}
                                        disabled={session.status === "Completed"}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#7B2C2C] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#651F1F] disabled:cursor-not-allowed disabled:bg-[#E7E2DC] disabled:text-[#A8A29E]"
                                    >
                                        <Video size={14} />
                                        Join Session
                                    </button>
                                    <button
                                        onClick={() => openEditModal(session)}
                                        aria-label="Edit session"
                                        className="rounded-md border border-[#E7E2DC] p-2 text-[#6B6660] transition hover:border-[#7B2C2C] hover:text-[#7B2C2C]"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(session)}
                                        aria-label="Delete session"
                                        className="rounded-md border border-[#E7E2DC] p-2 text-[#6B6660] transition hover:border-[#B91C1C] hover:text-[#B91C1C]"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
                )}
            </div>

            <SessionFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                initialData={editingSession}
            />

            {deleteTarget && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}
            >
                <div className="w-full max-w-sm rounded-lg border border-[#E7E2DC] bg-white p-6 shadow-xl">
                    <h3 className="text-base font-semibold text-[#1C1917]">Delete session?</h3>
                    <p className="mt-2 text-sm text-[#6B6660]">
                        This will permanently remove "{deleteTarget.sessionName}" from the session list.
                        This action cannot be undone.
                    </p>
                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="rounded-md border border-[#E7E2DC] bg-white px-4 py-2 text-sm font-medium text-[#3F3A35] transition hover:bg-[#F5F3F0]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-[#B91C1C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#991515]"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            )}

            {joiningSession && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-[#E7E2DC] bg-white px-4 py-3 text-sm text-[#1C1917] shadow-lg">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7B2C2C] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7B2C2C]" />
                </span>
                Joining "{joiningSession.sessionName}"...
            </div>
            )}
        </div>
    );
}

export default SessionManagement;