export const COLORS = {
    ink: "#14231F",
    inkSoft: "#57635C",
    paper: "#F5F6F2",
    surface: "#FFFFFF",
    hairline: "#E3E7DF",
    rec: "#E1483C",
    recDark: "#C13327",
    tape: "#0B7A68",
    tapeSoft: "#E3F1EE",
};

export const SESSION_META = {
    "Product Standup": { tint: "#3B6FD1", soft: "#E7EEFB" },
    "Design Review": { tint: "#8A4FD1", soft: "#EFE6FB" },
    "Client Onboarding": { tint: "#C98A2C", soft: "#FBF0DF" },
    "Sprint Retro": { tint: "#0B7A68", soft: "#E3F1EE" },
    "1:1 Sync": { tint: "#D1508A", soft: "#FBE6F0" },
    "All-Hands": { tint: "#E1483C", soft: "#FBE4E1" },
};

export const FALLBACK_META = { tint: COLORS.tape, soft: COLORS.tapeSoft };
export const SESSIONS = Object.keys(SESSION_META);
export const DURATION_PATTERN = /^([0-9]{1,2}):([0-5][0-9])$/;

export function makeMockId() {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `REC-${stamp}-${rand}`;
}

export const SEED_RECORDINGS = [
    { id: "REC-9K2M-A1", title: "Sprint 12 planning walkthrough", session: "Sprint Retro", duration: "18:42", fileName: "sprint12-planning.mp4", recordedAt: "2026-06-29T15:00:00Z" },
    { id: "REC-7Q1L-B4", title: "New hire onboarding — platform tour", session: "Client Onboarding", duration: "31:05", fileName: "onboarding-tour.mov", recordedAt: "2026-07-01T10:30:00Z" },
    { id: "REC-3X8P-C7", title: "Homepage redesign critique", session: "Design Review", duration: "24:15", fileName: "homepage-critique.mp4", recordedAt: "2026-07-03T13:15:00Z" },
    { id: "REC-5H4N-D2", title: "Monday async standup", session: "Product Standup", duration: "07:58", fileName: "standup-mon.mp4", recordedAt: "2026-07-06T09:05:00Z" },
];

export function waveformBars(seed, count = 34) {
    let x = 0;
    for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 1000;
    const bars = [];
    for (let i = 0; i < count; i++) {
        x = (x * 1103515245 + 12345) % 2147483648;
        bars.push(18 + (x % 100) * 0.7);
    }
    return bars;
}

export function durationToSeconds(d) {
    const [m, s] = d.split(":").map(Number);
    return (m || 0) * 60 + (s || 0);
}

export function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
}