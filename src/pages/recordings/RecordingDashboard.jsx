import { useMemo, useState } from "react";
import { COLORS, SESSION_META, FALLBACK_META, SEED_RECORDINGS, waveformBars, durationToSeconds, timeAgo } from "../../lib/constants";
import { Icon } from "../../assets/icons";
import { UploadRecordingModal } from "../../components/UploadRecordingModal";

const Thumbnail = ({ recording, meta }) => {
    const bars = useMemo(() => waveformBars(recording.id), [recording.id]);
    return (
        <div className="relative h-32 overflow-hidden" style={{ background: `linear-gradient(140deg, ${meta.tint} 0%, ${COLORS.ink} 130%)` }}>
            <div className="absolute inset-x-0 bottom-0 h-14 flex items-end gap-0.75 px-4 opacity-70">
                {bars.map((h, i) => (<div key={i} className="flex-1 rounded-full bg-white" style={{ height: `${h}%`, opacity: 0.35 }} />))}
            </div>
            <div className="absolute inset-0 grid place-items-center">
                <div className="h-11 w-11 rounded-full bg-white/90 grid place-items-center shadow-lg transition-transform group-hover:scale-110">
                <Icon.Play className="h-4.5 w-4.5 ml-0.5" style={{ color: meta.tint }} />
                </div>
            </div>
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "rgba(15,26,22,0.65)", fontFamily: "'IBM Plex Mono', monospace" }}>
                {recording.duration}
            </span>
        </div>
    );
}

const RecordingCard = ({ recording }) => {
    const meta = SESSION_META[recording.session] || FALLBACK_META;
    return (
        <div className="group rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-0.5" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.hairline}`, boxShadow: "0 1px 2px rgba(15,26,22,0.04)" }}>
            <Thumbnail recording={recording} meta={meta} />
            <div className="p-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: COLORS.ink }}>{recording.title}</h3>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: meta.soft, color: meta.tint }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.tint }} />
                        {recording.session}
                    </span>
                    <span className="inline-flex items-center gap-1" style={{ color: COLORS.inkSoft }}>
                        <Icon.Cal className="h-3 w-3" />
                        {timeAgo(recording.recordedAt)}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2 text-[11px]" style={{ borderTop: `1px solid ${COLORS.hairline}`, color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
                    <span>{recording.id}</span>
                    <span className="truncate max-w-[45%]">{recording.fileName}</span>
                </div>
            </div>
        </div>
    );
}

const StatPill = ({ icon, label, value }) => {
    return (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <span className="h-8 w-8 rounded-lg grid place-items-center" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#8FE3D2" }}>{icon}</span>
            <div>
                <p className="text-base font-bold text-white leading-none" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{value}</p>
                <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
            </div>
        </div>
    );
}

const RecordingDashboard = () => {
    const [recordings, setRecordings] = useState(SEED_RECORDINGS);
    const [modalOpen, setModalOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeSession, setActiveSession] = useState("All");

    const handleUpload = (recording) => setRecordings((prev) => [recording, ...prev]);

    const sessionOptions = ["All", ...Object.keys(SESSION_META).filter((s) => recordings.some((r) => r.session === s))];
    const filtered = recordings.filter((r) => {
        const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase());
        const matchesSession = activeSession === "All" || r.session === activeSession;
        return matchesQuery && matchesSession;
    });

    const totalSeconds = recordings.reduce((sum, r) => sum + durationToSeconds(r.duration), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const sessionCount = new Set(recordings.map((r) => r.session)).size;

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.paper }}>
            <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1F3A32 100%)` }}>
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20" style={{ background: COLORS.tape }} />
                <div className="absolute right-32 bottom-0 h-40 w-40 rounded-full opacity-10" style={{ background: COLORS.rec }} />
                <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div>
                            <p className="text-[11px] tracking-[0.18em] uppercase font-semibold mb-2" style={{ color: "#8FE3D2", fontFamily: "'IBM Plex Mono', monospace" }}>Recording library</p>
                            <h1 className="text-3xl font-bold text-white">Recordings</h1>
                            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Every session, captured and ready to revisit.</p>
                        </div>
                        <button type="button" onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]" style={{ background: `linear-gradient(135deg, ${COLORS.rec} 0%, ${COLORS.recDark} 100%)`, boxShadow: "0 10px 24px -8px rgba(225,72,60,0.55)" }}>
                            <Icon.Plus className="h-4 w-4" />
                            Upload Recording
                        </button>
                    </div>

                    <div className="flex gap-3 mt-8 flex-wrap">
                        <StatPill icon={<Icon.Stack className="h-4 w-4" />} label="Recordings" value={String(recordings.length).padStart(2, "0")} />
                        <StatPill icon={<Icon.Clock className="h-4 w-4" />} label="Hours captured" value={`${totalHours}h`} />
                        <StatPill icon={<Icon.Cal className="h-4 w-4" />} label="Active sessions" value={String(sessionCount).padStart(2, "0")} />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl flex-1 min-w-55" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.hairline}` }}>
                    <Icon.Search className="h-4 w-4 shrink-0" style={{ color: COLORS.inkSoft }} />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recordings…" className="w-full text-sm bg-transparent focus:outline-none" style={{ color: COLORS.ink }} />
                </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {sessionOptions.map((s) => {
                        const active = activeSession === s;
                        const meta = SESSION_META[s] || FALLBACK_META;
                        return (
                            <button key={s} onClick={() => setActiveSession(s)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors" style={{ backgroundColor: active ? (s === "All" ? COLORS.ink : meta.tint) : COLORS.surface, color: active ? "#FFFFFF" : COLORS.inkSoft, border: `1px solid ${active ? "transparent" : COLORS.hairline}` }}>
                            {s}
                            </button>
                        );
                        })}
                    </div>
                </div>

                {filtered.length === 0 ? (
                <div className="rounded-2xl p-14 text-center" style={{ backgroundColor: COLORS.surface, border: `1.5px dashed ${COLORS.hairline}` }}>
                    <div className="h-12 w-12 rounded-full mx-auto mb-3 grid place-items-center" style={{ backgroundColor: COLORS.tapeSoft, color: COLORS.tape }}>
                    <Icon.Stack className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>{recordings.length === 0 ? "No recordings yet" : "No matches"}</p>
                    <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>{recordings.length === 0 ? "Upload your first recording to see it here." : "Try a different search or filter."}</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((r) => (<RecordingCard key={r.id} recording={r} />))}
                </div>
                )}
            </div>

            <UploadRecordingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onUpload={handleUpload} />
        </div>
    );
}

export default RecordingDashboard;