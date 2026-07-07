import { useRef, useState } from "react";
import { COLORS, SESSIONS, DURATION_PATTERN, makeMockId } from "../lib/constants";
import { Icon } from "../assets/icons";

export function UploadRecordingModal({ isOpen, onClose, onUpload }) {
    const emptyForm = { session: "", title: "", file: null, duration: "" };
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const [phase, setPhase] = useState("idle");
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!form.session) next.session = "Choose the session this recording belongs to.";
        if (!form.title.trim()) next.title = "Give the recording a title.";
        if (!form.file) next.file = "Attach a video file to upload.";
        if (!form.duration.trim()) next.duration = "Enter the recording's length.";
        else if (!DURATION_PATTERN.test(form.duration.trim())) next.duration = "Use mm:ss, like 24:15.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleFile = (fileList) => {
        const file = fileList && fileList[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setErrors((prev) => ({ ...prev, file: "That's not a video file." }));
            return;
        }
        setField("file", file);
    };

    const resetAndClose = () => {
        setForm(emptyForm);
        setErrors({});
        setPhase("idle");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phase !== "idle") return;
        if (!validate()) return;
        setPhase("uploading");
        window.setTimeout(() => {
            const recording = {
                id: makeMockId(),
                title: form.title.trim(),
                session: form.session,
                duration: form.duration.trim(),
                fileName: form.file.name,
                recordedAt: new Date().toISOString(),
            };
            setPhase("done");
            window.setTimeout(() => {
                onUpload(recording);
                resetAndClose();
            }, 500);
        }, 700);
    };

    const isBusy = phase !== "idle";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(15,26,22,0.6)", backdropFilter: "blur(2px)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget && !isBusy) resetAndClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: COLORS.surface, boxShadow: "0 24px 60px -12px rgba(15,26,22,0.35), 0 0 0 1px rgba(15,26,22,0.04)" }}>
                <div className="relative px-6 py-5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1F3A32 100%)` }}>
                    <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full opacity-20" style={{ background: COLORS.tape }} />
                        <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "#8FE3D2", fontFamily: "'IBM Plex Mono', monospace" }}>New recording</p>
                            <h2 className="text-lg font-bold mt-1 text-white">Upload a recording</h2>
                        </div>
                            <button type="button" onClick={resetAndClose} disabled={isBusy} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-40" style={{ color: "#FFFFFF" }}>
                            <Icon.Close className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5" style={{ color: COLORS.ink }}>
                        <Icon.Layers className="h-3.5 w-3.5" style={{ color: COLORS.tape }} />
                            Session
                        </label>
                        <select value={form.session} onChange={(e) => setField("session", e.target.value)} disabled={isBusy} className="w-full rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-shadow" style={{ border: `1.5px solid ${errors.session ? COLORS.rec : COLORS.hairline}`, color: form.session ? COLORS.ink : COLORS.inkSoft }}>
                        <option value="">Select a session…</option>
                            {SESSIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                        {errors.session && <p className="mt-1 text-xs" style={{ color: COLORS.rec }}>{errors.session}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5" style={{ color: COLORS.ink }}>
                        <Icon.Type className="h-3.5 w-3.5" style={{ color: COLORS.tape }} />
                            Recording title
                        </label>
                        <input type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Sprint 14 planning walkthrough" disabled={isBusy} className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow" style={{ border: `1.5px solid ${errors.title ? COLORS.rec : COLORS.hairline}`, color: COLORS.ink }} />
                        {errors.title && <p className="mt-1 text-xs" style={{ color: COLORS.rec }}>{errors.title}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5" style={{ color: COLORS.ink }}>
                        <Icon.Film className="h-3.5 w-3.5" style={{ color: COLORS.tape }} />
                            Video file
                        </label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); if (!isBusy) setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => { e.preventDefault(); setDragActive(false); if (!isBusy) handleFile(e.dataTransfer.files); }}
                            onClick={() => !isBusy && fileInputRef.current?.click()}
                            className="rounded-lg px-4 py-6 text-center transition-all"
                            style={{ cursor: isBusy ? "default" : "pointer", border: `1.5px dashed ${dragActive ? COLORS.tape : errors.file ? COLORS.rec : COLORS.hairline}`, backgroundColor: dragActive ? COLORS.tapeSoft : COLORS.paper, transform: dragActive ? "scale(1.01)" : "scale(1)" }}
                        >
                        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFile(e.target.files)} disabled={isBusy} />
                        {form.file ? (
                            <div className="flex items-center justify-center gap-2">
                            <span className="h-8 w-8 rounded-full grid place-items-center shrink-0" style={{ backgroundColor: COLORS.tapeSoft, color: COLORS.tape }}>
                                <Icon.Film className="h-4 w-4" />
                            </span>
                            <p className="text-sm font-medium truncate" style={{ color: COLORS.tape }}>{form.file.name}</p>
                            </div>
                        ) : (
                            <>
                            <p className="text-sm font-medium" style={{ color: COLORS.ink }}>Drop a video here, or click to browse</p>
                            <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>MP4, MOV, or WebM</p>
                            </>
                        )}
                        </div>
                        {errors.file && <p className="mt-1 text-xs" style={{ color: COLORS.rec }}>{errors.file}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5" style={{ color: COLORS.ink }}>
                            <Icon.Clock className="h-3.5 w-3.5" style={{ color: COLORS.tape }} />
                            Duration
                        </label>
                        <input type="text" value={form.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="mm:ss, e.g. 24:15" disabled={isBusy} className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow" style={{ border: `1.5px solid ${errors.duration ? COLORS.rec : COLORS.hairline}`, color: COLORS.ink, fontFamily: "'IBM Plex Mono', monospace" }} />
                        {errors.duration && <p className="mt-1 text-xs" style={{ color: COLORS.rec }}>{errors.duration}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button type="button" onClick={resetAndClose} disabled={isBusy} className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-40" style={{ color: COLORS.inkSoft }}>Cancel</button>
                        <button type="submit" disabled={isBusy} className="relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:cursor-default overflow-hidden min-w-38" style={{ background: phase === "done" ? COLORS.tape : `linear-gradient(135deg, ${COLORS.rec} 0%, ${COLORS.recDark} 100%)`, boxShadow: "0 6px 16px -6px rgba(225,72,60,0.55)" }}>
                            {phase === "idle" && "Upload recording"}
                            {phase === "uploading" && (<span className="flex items-center justify-center gap-2"><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />Uploading…</span>)}
                            {phase === "done" && (<span className="flex items-center justify-center gap-2"><Icon.Check className="h-4 w-4" />Added</span>)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadRecordingModal;