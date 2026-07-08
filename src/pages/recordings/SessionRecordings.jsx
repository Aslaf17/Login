import { useState, useEffect, useRef } from 'react';
import { Play, Download, Trash2, X, Loader2, Upload, AlertTriangle, Disc3, FilmIcon, RotateCcw} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api/recordings'; 

const mockRecordings = [
  { id: 'rec_001', sessionName: 'Onboarding Walkthrough', duration: '12:34', uploadedDate: '2026-07-01T10:20:00Z' },
  { id: 'rec_002', sessionName: 'Bug Reproduction - Checkout Flow', duration: '05:12', uploadedDate: '2026-07-03T14:05:00Z' },
  { id: 'rec_003', sessionName: 'User Interview - Sarah K.', duration: '28:47', uploadedDate: '2026-07-05T09:15:00Z' },
];

const FONT_URL =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap';

const formatDate = (iso) => {
      try {
        const d = new Date(iso);
        return (
        d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        );
    } catch {
        return iso;
    }
}

const waveform = (seed, count = 34) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const bars = [];
    for (let i = 0; i < count; i++) {
        h = (h * 1103515245 + 12345) >>> 0;
        bars.push(14 + (h % 100) * 0.66);
    }
    return bars;
}


const tapeCounter = (duration) => {
    const parts = duration.split(':').map((n) => parseInt(n, 10) || 0);
    let seconds = 0;
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    return String(seconds).padStart(4, '0');
}

const SessionRecordings = () => {

    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [playingRecording, setPlayingRecording] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const fetchRecordings = async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to fetch recordings');
        const data = await res.json();
        setRecordings(data);
        } catch (err) {
        console.error('Error fetching recordings:', err);
        setRecordings(mockRecordings);
        setError(`Backend unreachable — showing demo tapes (${err.message})`);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error('Failed to fetch recordings');
            const data = await res.json();
            if (!cancelled) setRecordings(data);
        } catch (err) {
            console.error('Error fetching recordings:', err);
            if (!cancelled) {
            setRecordings(mockRecordings);
            setError(`Backend unreachable — showing demo tapes (${err.message})`);
            }
        } finally {
            if (!cancelled) setLoading(false);
        }
        };
        load();
        return () => {
        cancelled = true;
        };
    }, []);

    const handleDownload = (recording) => window.open(`${API_BASE}/${recording.id}/download`, '_blank');

    const handleDeleteConfirm = async (id) => {
        setDeletingId(id);
        try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        } catch (err) {
        console.error('Error deleting recording:', err);
        setError(`Delete failed — ${err.message}`);
        } finally {
        setRecordings((prev) => prev.filter((r) => r.id !== id));
        setDeletingId(null);
        setConfirmDeleteId(null);
        }
    };

    const handleUpload = async (file, sessionName, duration) => {
        setUploading(true);
        try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionName', sessionName);
        formData.append('duration', duration);

        const res = await fetch(API_BASE, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');

        await fetchRecordings();
        setShowUploadModal(false);
        } catch (err) {
        console.error('Error uploading recording:', err);
        setError(`Upload failed — ${err.message}`);
        } finally {
        setUploading(false);
        }
    };

    return (
        <div
        className="min-h-screen w-full"
        style={{
            background: 'radial-gradient(1200px 520px at 12% -10%, #191B21 0%, #0A0B0E 55%), #0A0B0E',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#EDEEF1',
        }}
        >
        <style>{`
            @import url('${FONT_URL}');
            .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
            @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes spin-slow-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
            .reel-a { animation: spin-slow 3.2s linear infinite; }
            .reel-b { animation: spin-slow-rev 3.2s linear infinite; }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
            .rec-blink { animation: blink 1.4s ease-in-out infinite; }
            .tape-card { transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease; }
            .tape-card:hover { transform: translateY(-4px); border-color: #33363F; box-shadow: 0 20px 40px -20px rgba(0,0,0,0.6); }
            .tape-card:hover .reel-static { animation: spin-slow 6s linear infinite; }
            .btn-press:active { transform: scale(0.97); }
            ::selection { background: #FF4757; color: white; }
            @media (prefers-reduced-motion: reduce) {
            .reel-a, .reel-b, .rec-blink, .tape-card:hover .reel-static { animation: none !important; }
            }
        `}</style>

        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between gap-4 mb-9 flex-col sm:flex-row">
            <div>
                <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4757] rec-blink" />
                <span className="mono text-[11px] tracking-[0.22em] text-[#7A7D85] uppercase">
                    Session Archive
                </span>
                </div>
                <h1 className="text-3xl sm:text-[36px] tracking-tight text-white" style={{ fontWeight: 800 }}>
                Recordings
                </h1>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto">
                <span className="mono text-xs text-[#6B6E76] border border-[#23252C] rounded-full px-3.5 py-2 whitespace-nowrap">
                {recordings.length} {recordings.length === 1 ? 'tape' : 'tapes'}
                </span>
                <button
                onClick={() => setShowUploadModal(true)}
                className="btn-press flex items-center gap-2 bg-[#FF4757] hover:bg-[#ff5f6e] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-[0_0_0_1px_rgba(255,71,87,0.35),0_10px_28px_-10px_rgba(255,71,87,0.65)]"
                >
                <Upload className="w-4 h-4" />
                Upload
                </button>
            </div>
            </div>

            {error && (
            <div className="mb-6 flex items-start gap-2.5 text-sm text-[#F5A623] bg-[#211B10] border border-[#3A2E14] rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
            </div>
            )}

            {loading ? (
            <div className="flex flex-col items-center justify-center h-72 gap-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#FF4757]" />
                <span className="mono text-xs text-[#6B6E76] tracking-widest uppercase">Loading tapes…</span>
            </div>
            ) : recordings.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#23252C] rounded-2xl">
                <FilmIcon className="w-9 h-9 mx-auto mb-3 text-[#3A3D45]" />
                <p className="text-[#8A8D93] text-sm">No recordings yet.</p>
                <p className="text-[#54575F] text-xs mt-1">Upload a session to see it here.</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recordings.map((recording) => (
                <RecordingCard
                    key={recording.id}
                    recording={recording}
                    onPlay={() => setPlayingRecording(recording)}
                    onDownload={() => handleDownload(recording)}
                    onDeleteClick={() => setConfirmDeleteId(recording.id)}
                    deleting={deletingId === recording.id}
                />
                ))}
            </div>
            )}
        </div>

        {playingRecording && (
            <PlayerModal recording={playingRecording} onClose={() => setPlayingRecording(null)} />
        )}

        {confirmDeleteId && (
            <ConfirmDeleteModal
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={() => handleDeleteConfirm(confirmDeleteId)}
            />
        )}

        {showUploadModal && (
            <UploadModal
            uploading={uploading}
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
            />
        )}
        </div>
    );
}

export default SessionRecordings;

const RecordingCard = ({ recording, onPlay, onDownload, onDeleteClick, deleting }) => {
    const bars = waveform(recording.id || recording.sessionName);
    const counter = tapeCounter(recording.duration || '0:00');

    return (
        <div
        className="tape-card bg-[#121319] border border-[#23252C] rounded-2xl p-5 flex flex-col"
        style={{ boxShadow: '0 1px 0 0 rgba(255,255,255,0.03) inset' }}
        >
        <div className="flex items-center justify-between mb-4">
            <span className="mono text-[10px] text-[#5C5F68] tracking-wider truncate max-w-[55%]">
            {recording.id}
            </span>
            <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full border-2 border-[#33353D] reel-static" />
            <span className="w-4 h-4 rounded-full border-2 border-[#33353D] reel-static" />
            </div>
        </div>

        <h2 className="text-[15px] font-semibold text-white leading-snug truncate mb-3">
            {recording.sessionName}
        </h2>

        <div className="flex items-end gap-0.75 h-10 mb-4">
            {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-full bg-[#2B2D35]" style={{ height: `${h}%` }} />
            ))}
        </div>

        <div className="flex items-center justify-between mono text-xs text-[#8A8D93] mb-5 pb-4 border-b border-[#1E2027]">
            <span className="flex items-center gap-2">
            <span className="text-[#3DE0A6] font-medium">{recording.duration}</span>
            <span className="text-[#4A4D55]">·</span>
            <span className="text-[#54575F]">{counter}</span>
            </span>
            <span>{formatDate(recording.uploadedDate)}</span>
        </div>

        <div className="mt-auto flex gap-2">
            <button
            onClick={onPlay}
            className="btn-press flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-[#e9e9ec] text-black text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
            <Play className="w-3.5 h-3.5 fill-black" />
            Play
            </button>
            <button
            onClick={onDownload}
            title="Download"
            className="btn-press flex items-center justify-center bg-[#1B1D24] hover:bg-[#23252E] text-[#C7C9CF] py-2.5 px-3 rounded-xl transition-colors border border-[#26282F]"
            >
            <Download className="w-4 h-4" />
            </button>
            <button
            onClick={onDeleteClick}
            title="Delete"
            className="btn-press flex items-center justify-center bg-[#1F1416] hover:bg-[#2A1719] text-[#FF6B6B] py-2.5 px-3 rounded-xl transition-colors border border-[#2E1A1C]"
            >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
        </div>
    );
}

const PlayerModal = ({ recording, onClose }) => {
    const [videoError, setVideoError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const src = `${API_BASE}/${recording.id}/stream`;

    const retry = () => {
        setVideoError(false);
        videoRef.current?.load();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
            className="bg-[#121319] border border-[#23252C] rounded-2xl max-w-2xl w-full overflow-hidden"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2027]">
            <div className="flex items-center gap-2.5 min-w-0">
                <Disc3 className={`w-4 h-4 text-[#FF4757] shrink-0 ${isPlaying ? 'reel-a' : ''}`} />
                <div className="min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{recording.sessionName}</h3>
                <p className="mono text-[10px] text-[#5C5F68] truncate">{recording.id}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-[#6B6E76] hover:text-white shrink-0 ml-3">
                <X className="w-5 h-5" />
            </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
            {videoError ? (
                <div className="text-center px-8">
                <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-[#F5A623]" />
                <p className="text-sm text-[#C7C9CF] mb-1">This recording can't be played.</p>
                <p className="text-xs text-[#6B6E76] mb-4">
                    The stream endpoint didn't respond. Check that the backend is running at{' '}
                    <span className="mono text-[#8A8D93]">{API_BASE}</span>.
                </p>
                <button
                    onClick={retry}
                    className="btn-press inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#1B1D24] hover:bg-[#23252E] border border-[#26282F] px-3.5 py-2 rounded-lg"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry
                </button>
                </div>
            ) : (
                <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full"
                src={src}
                onError={() => setVideoError(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                >
                Your browser does not support video playback.
                </video>
            )}
            </div>
        </div>
        </div>
    );
}

const ConfirmDeleteModal = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121319] border border-[#23252C] rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#2A1719] flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
            </div>
            <h3 className="font-semibold text-white text-[15px]">Delete recording?</h3>
            </div>
            <p className="text-sm text-[#8A8D93] mb-6 pl-10.5">This action can't be undone.</p>
            <div className="flex justify-end gap-2.5">
            <button
                onClick={onCancel}
                className="btn-press px-4 py-2 text-sm font-medium rounded-xl text-[#C7C9CF] hover:bg-[#1B1D24]"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="btn-press px-4 py-2 text-sm font-semibold rounded-xl bg-[#FF4757] hover:bg-[#ff5f6e] text-white"
            >
                Delete
            </button>
            </div>
        </div>
        </div>
    );
}

const UploadModal = ({ uploading, onClose, onUpload }) => {
    const [sessionName, setSessionName] = useState('');
    const [duration, setDuration] = useState('');
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const canSubmit = file && sessionName && duration && !uploading;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onUpload(file, sessionName, duration);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) setFile(f);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#121319] border border-[#23252C] rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-[15px]">Upload recording</h3>
            <button onClick={onClose} className="text-[#6B6E76] hover:text-white">
                <X className="w-5 h-5" />
            </button>
            </div>

            <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-[#8A8D93] mb-1.5 mono uppercase tracking-wide">
                Session name
                </label>
                <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full bg-[#0D0E12] border border-[#23252C] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#54575F] focus:outline-none focus:ring-2 focus:ring-[#FF4757]/50 focus:border-[#FF4757]/60"
                placeholder="e.g. Sprint Planning Session"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-[#8A8D93] mb-1.5 mono uppercase tracking-wide">
                Duration
                </label>
                <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#0D0E12] border border-[#23252C] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#54575F] focus:outline-none focus:ring-2 focus:ring-[#FF4757]/50 focus:border-[#FF4757]/60 mono"
                placeholder="e.g. 15:30"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-[#8A8D93] mb-1.5 mono uppercase tracking-wide">
                Video file
                </label>
                <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl px-4 py-6 cursor-pointer transition-colors ${
                    dragOver ? 'border-[#FF4757] bg-[#1a1214]' : 'border-[#2B2D35] hover:border-[#3A3D45]'
                }`}
                >
                <Upload className="w-5 h-5 text-[#6B6E76]" />
                <span className="text-xs text-[#8A8D93] text-center">
                    {file ? file.name : 'Drop a video here, or click to browse'}
                </span>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                />
                </label>
            </div>

            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="btn-press w-full flex items-center justify-center gap-2 bg-[#FF4757] hover:bg-[#ff5f6e] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors mt-2"
            >
                {uploading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                </>
                ) : (
                'Upload recording'
                )}
            </button>
            </div>
        </div>
        </div>
    );
}