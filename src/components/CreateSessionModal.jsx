import React, { useState } from "react";

const MOCK_BATCHES = [
    { id: "batch-01", name: "React Fundamentals — Batch A" },
    { id: "batch-02", name: "Data Structures — Batch B" },
    { id: "batch-03", name: "UI/UX Design Sprint — Batch C" },
    { id: "batch-04", name: "Full Stack Bootcamp — Batch D" },
];

const generateSessionId = () => {
    return `RM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

export default function CreateSessionModal({ isOpen, onClose, onCreate }) {
    const [batchId, setBatchId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const resetForm = () => {
        setBatchId("");
        setDate("");
        setTime("");
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!batchId || !date || !time) {
            setError("Fill in batch, date, and time to generate a meeting.");
        return;
        }
        const batch = MOCK_BATCHES.find((b) => b.id === batchId);
        onCreate({
            id: generateSessionId(),
            batchName: batch ? batch.name : "Unknown Batch",
            date,
            time,
            notified: false,
        });
        resetForm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-3xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-100 overflow-hidden animate-[fadeIn_.15s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header strip */}
                <div className="relative bg-blue-500 px-6 py-5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
                        New session
                        </p>
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Set up a live class
                    </h2>
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Batch
                        </label>
                        <select
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                        >
                            <option value="">Choose a batch…</option>
                            {MOCK_BATCHES.map((b) => (
                                <option key={b.id} value={b.id}>
                                {b.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                        {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-linear-to-r from-blue-400 to-blue-600 cursor-pointer px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/30 hover:bg-teal-700 active:scale-[.98] transition"
                        >
                            Generate Meeting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}