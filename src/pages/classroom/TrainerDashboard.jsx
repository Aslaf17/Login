import React, { useState } from "react";
import CreateSessionModal from "../../components/CreateSessionModal";
import { Users, Layers, CalendarClock, TrendingUp } from "lucide-react";

const INITIAL_SESSIONS = [
    {
        id: "RM-A1B2C3",
        batchName: "React Fundamentals — Batch A",
        date: "2026-07-08",
        time: "10:00",
        duration: 60,
        enrolled: 24,
        notified: false,
    },
    {
        id: "RM-X9Y8Z7",
        batchName: "Data Structures — Batch B",
        date: "2026-07-09",
        time: "14:30",
        duration: 90,
        enrolled: 31,
        notified: true,
    },
    {
        id: "RM-K4L5M6",
        batchName: "UI/UX Design Sprint — Batch C",
        date: "2026-07-10",
        time: "09:00",
        duration: 45,
        enrolled: 18,
        notified: false,
    },
];

const STATS = [
    {
        label: "Total Students",
        value: 186,
        delta: "+12 this month",
        accent: "teal",
        icon: Users,
    },
    {
        label: "Active Batches",
        value: 8,
        delta: "3 running today",
        accent: "amber",
        icon: Layers,
    },
    {
        label: "Sessions This Week",
        value: 14,
        delta: "5 completed",
        accent: "sky",
        icon: CalendarClock,
    },
    {
        label: "Avg. Attendance",
        value: "92%",
        delta: "+4% vs last week",
        accent: "emerald",
        icon: TrendingUp,
    },
];

const accentMap = {
    teal: {
        top: "from-teal-400 to-teal-600",
        iconBg: "bg-teal-50",
        iconText: "text-teal-600",
        delta: "text-teal-600",
    },
    amber: {
        top: "from-amber-400 to-amber-600",
        iconBg: "bg-amber-50",
        iconText: "text-amber-600",
        delta: "text-amber-600",
    },
    sky: {
        top: "from-sky-400 to-sky-600",
        iconBg: "bg-sky-50",
        iconText: "text-sky-600",
        delta: "text-sky-600",
    },
    emerald: {
        top: "from-emerald-400 to-emerald-600",
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        delta: "text-emerald-600",
    },
};

export default function TrainerDashboard() {
    const [sessions, setSessions] = useState(INITIAL_SESSIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateSession = (newSession) => {
        setSessions((prev) => [
            { ...newSession, duration: 60, enrolled: Math.floor(Math.random() * 20) + 10 },
            ...prev,
        ]);
    };

    const handleNotify = (sessionId) => {
        setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, notified: true } : s))
        );
        alert("Students have been notified about this session.");
    };

    const handleStartSession = (sessionId) => {
        console.log(`Routing trainer into live classroom for session: ${sessionId}`);
        alert(`Starting session ${sessionId} — redirecting to the live whiteboard classroom.`);
        // navigate(`/classroom/${sessionId}`);
    };

    const formatDateTime = (date, time) => {
        if (!date || !time) return "";
            const dt = new Date(`${date}T${time}`);
        return dt.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const upcomingCount = sessions.filter((s) => !s.notified).length;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                            AS
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Welcome back</p>
                            <h1 className="text-lg font-bold text-slate-900">Aslaf</h1>
                        </div>
                    </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl bg-linear-to-r from-blue-400 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/30 hover:bg-teal-700 active:scale-[.98] transition"
                >
                    <span className="text-base leading-none">+</span> Create Live Session
                </button>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                    {STATS.map((stat) => {
                        const accent = accentMap[stat.accent];
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* accent bar */}
                                <div
                                    className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent.top}`}
                                />

                                <div className="flex items-start justify-between">
                                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent.iconBg} ${accent.iconText} transition-transform group-hover:scale-105`}
                                    >
                                        <Icon className="h-4 w-4" strokeWidth={2.25} />
                                    </span>
                                </div>

                                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                                    {stat.value}
                                </p>
                                <p className={`mt-1 text-[11px] font-medium ${accent.delta}`}>
                                    {stat.delta}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">Upcoming Sessions</h2>
                            <p className="text-xs text-slate-400">
                            {sessions.length} scheduled · {upcomingCount} awaiting notification
                        </p>
                    </div>
                </div>

                {/* Session list */}
                {sessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                        <p className="text-sm text-slate-500">
                        No sessions scheduled yet — create one to get started.
                        </p>
                    </div>
                    ) : (
                    <div className="space-y-3">
                        {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md hover:border-teal-200"
                        >
                            <div className="flex items-center gap-4">
                            <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                session.notified ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
                                }`}
                            />

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-md bg-blue-500 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-teal-300">
                                        {session.id}
                                    </span>
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                        {session.duration} min
                                    </span>
                                </div>
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {session.batchName}
                                </p>
                                <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                                    <span>{formatDateTime(session.date, session.time)}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{session.enrolled} students enrolled</span>
                                </div>
                            </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {session.notified ? (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
                                        Students Notified
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleNotify(session.id)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 cursor-pointer text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-amber-300 hover:text-amber-600 transition"
                                    >
                                        Notify Students
                                    </button>
                                )}

                                <button
                                    onClick={() => handleStartSession(session.id)}
                                    className="rounded-lg bg-linear-to-r from-blue-400 to-blue-600 cursor-pointer px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:scale-[.98] transition"
                                >
                                    Start Session →
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateSession}
            />
        </div>
  );
}