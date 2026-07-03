import { useEffect, useRef, useState, useCallback } from "react";

const STORAGE_KEY = "dc_whiteboard_state_v1";

const STROKE_COLORS = ["#1a1a2e", "#d92d20", "#1d7a45", "#1d63d1", "#a34ad1"];
const STICKY_COLORS = ["#fff3b0", "#ffd6e0", "#c9f2c9", "#c9e2ff", "#ffe0b3"];

const uid = () =>
    window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const loadInitialState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export const Whiteboard = () => {

    const saved = loadInitialState();

    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const currentStrokeRef = useRef(null);
    const dragRef = useRef(null); // { id, kind, offsetX, offsetY } while dragging a note/textbox
    const shapeDraftRef = useRef(null); // { type, startX, startY } while drawing a shape

    const [theme, setTheme] = useState(saved?.theme || "light"); // default: light mode
    const [tool, setTool] = useState("pen");
    const [color, setColor] = useState(STROKE_COLORS[0]);
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0]);

    const [strokes, setStrokes] = useState((saved?.strokes || []).filter(Boolean)); // pen + eraser paths
    const [shapes, setShapes] = useState(saved?.shapes || []); // rectangle | circle | arrow
    const [textBoxes, setTextBoxes] = useState(saved?.textBoxes || []);
    const [stickyNotes, setStickyNotes] = useState(saved?.stickyNotes || []);
    const [draftShape, setDraftShape] = useState(null); // live preview while drag-drawing a shape

    const isDark = theme === "dark";

    useEffect(() => {
        const timeout = setTimeout(() => {
            const state = { theme, strokes, shapes, textBoxes, stickyNotes };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }, 300);
        return () => clearTimeout(timeout);
    }, [theme, strokes, shapes, textBoxes, stickyNotes]);

    const strokesRef = useRef(strokes);
    useEffect(() => {
        strokesRef.current = strokes;
    }, [strokes]);

    const paintStroke = (ctx, stroke) => {
        if (!stroke || !stroke.points || stroke.points.length < 2) return;
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = stroke.width;
        ctx.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.restore();
    };

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.restore();

        strokesRef.current.forEach((stroke) => paintStroke(ctx, stroke));
    }, []);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const { width, height } = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
    }, [redraw]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    useEffect(() => {
        redraw();
    }, [strokes, redraw]);

    const getPoint = (e) => {
        const rect = wrapperRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerDown = (e) => {
        if (dragRef.current) return; 
        const point = getPoint(e);

        if (tool === "pen" || tool === "eraser") {
        drawingRef.current = true;
        currentStrokeRef.current = {
            id: uid(),
            tool,
            color,
            width: tool === "eraser" ? strokeWidth * 4 : strokeWidth,
            points: [point],
        };
        return;
        }

        if (["rectangle", "circle", "arrow"].includes(tool)) {
        shapeDraftRef.current = { type: tool, startX: point.x, startY: point.y };
        setDraftShape({ type: tool, x: point.x, y: point.y, w: 0, h: 0 });
        return;
        }

        if (tool === "text") {
        const box = { id: uid(), x: point.x, y: point.y, text: "", color };
        setTextBoxes((prev) => [...prev, box]);
        setTool("select");
        return;
        }
    };

    const handlePointerMove = (e) => {
        if (dragRef.current) {
        const point = getPoint(e);
        const { id, kind, offsetX, offsetY } = dragRef.current;
        const nx = point.x - offsetX;
        const ny = point.y - offsetY;
        if (kind === "sticky") {
            setStickyNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x: nx, y: ny } : n)));
        } else if (kind === "text") {
            setTextBoxes((prev) => prev.map((t) => (t.id === id ? { ...t, x: nx, y: ny } : t)));
        } else if (kind === "shape") {
            setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x: nx, y: ny } : s)));
        }
        return;
        }

        if (drawingRef.current && currentStrokeRef.current) {
        const point = getPoint(e);
        currentStrokeRef.current.points.push(point);
        const ctx = canvasRef.current.getContext("2d");
        const pts = currentStrokeRef.current.points;
        const prev = pts[pts.length - 2];
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = currentStrokeRef.current.width;
        ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : color;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.restore();
        return;
        }

        if (shapeDraftRef.current) {
        const point = getPoint(e);
        const { type, startX, startY } = shapeDraftRef.current;
        setDraftShape({
            type,
            x: Math.min(startX, point.x),
            y: Math.min(startY, point.y),
            w: Math.abs(point.x - startX),
            h: Math.abs(point.y - startY),
            endX: point.x,
            endY: point.y,
            startX,
            startY,
        });
        }
    };

    const handlePointerUp = () => {
        if (dragRef.current) {
        dragRef.current = null;
        return;
        }

        if (drawingRef.current) {
        drawingRef.current = false;
        const finishedStroke = currentStrokeRef.current;
        currentStrokeRef.current = null;
        if (finishedStroke && finishedStroke.points.length > 1) {
            setStrokes((prev) => [...prev, finishedStroke]);
        }
        return;
        }

        if (shapeDraftRef.current && draftShape) {
        const { type } = shapeDraftRef.current;
        if (draftShape.w > 4 || draftShape.h > 4) {
            const shape = {
            id: uid(),
            type,
            color,
            strokeWidth,
            x: draftShape.x,
            y: draftShape.y,
            w: draftShape.w,
            h: draftShape.h,
            startX: draftShape.startX,
            startY: draftShape.startY,
            endX: draftShape.endX,
            endY: draftShape.endY,
            };
            setShapes((prev) => [...prev, shape]);
        }
        shapeDraftRef.current = null;
        setDraftShape(null);
        }
    };

    const startDrag = (e, id, kind) => {
        e.stopPropagation();
        const point = getPoint(e);
        let item;
        if (kind === "sticky") item = stickyNotes.find((n) => n.id === id);
        if (kind === "text") item = textBoxes.find((t) => t.id === id);
        if (kind === "shape") item = shapes.find((s) => s.id === id);
        if (!item) return;
        dragRef.current = { id, kind, offsetX: point.x - item.x, offsetY: point.y - item.y };
    };

    const addStickyNote = () => {
        const note = {
        id: uid(),
        x: 40 + stickyNotes.length * 18,
        y: 40 + stickyNotes.length * 18,
        text: "",
        color: stickyColor,
        };
        setStickyNotes((prev) => [...prev, note]);
    };

    const deleteShape = (id) => setShapes((prev) => prev.filter((s) => s.id !== id));
    const deleteText = (id) => setTextBoxes((prev) => prev.filter((t) => t.id !== id));
    const deleteSticky = (id) => setStickyNotes((prev) => prev.filter((n) => n.id !== id));

    const clearBoard = () => {
        if (!window.confirm("Clear the entire whiteboard? This cannot be undone.")) return;
        setStrokes([]);
        setShapes([]);
        setTextBoxes([]);
        setStickyNotes([]);
    };

    const tools = [
        { id: "select", label: "Select" },
        { id: "pen", label: "Pen" },
        { id: "eraser", label: "Eraser" },
        { id: "rectangle", label: "Rectangle" },
        { id: "circle", label: "Circle" },
        { id: "arrow", label: "Arrow" },
        { id: "text", label: "Text Box" },
    ];

    return (
        <div
            className={`flex flex-col w-full h-150 rounded-lg border overflow-hidden ${
                isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-gray-200 text-gray-900"
            }`}
        >
            <div
                className={`flex flex-wrap items-center gap-3 px-3 py-2 border-b ${
                isDark ? "border-slate-700" : "border-gray-200"
                }`}
            >
                <div className="flex items-center gap-1.5 flex-wrap">
                    {tools.map((t) => (
                        <button
                        key={t.id}
                        type="button"
                        onClick={() => setTool(t.id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                            tool === t.id
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                            : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        >
                        {t.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={addStickyNote}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                        isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                            : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        + Sticky Note
                    </button>
                </div>

                <div className="flex items-center gap-1.5">
                    {STROKE_COLORS.map((c) => (
                        <button
                        key={c}
                        type="button"
                        aria-label={`color ${c}`}
                        onClick={() => setColor(c)}
                        style={{ background: c }}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer ${
                            color === c ? (isDark ? "border-white" : "border-gray-900") : "border-transparent"
                        }`}
                        />
                    ))}
                    <input
                        type="range"
                        min={1}
                        max={12}
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        title="Stroke width"
                        className="ml-1 accent-indigo-600"
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    {STICKY_COLORS.map((c) => (
                        <button
                        key={c}
                        type="button"
                        aria-label={`sticky color ${c}`}
                        onClick={() => setStickyColor(c)}
                        style={{ background: c }}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer ${
                            stickyColor === c ? (isDark ? "border-white" : "border-gray-900") : "border-transparent"
                        }`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                    <button
                        type="button"
                        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                        isDark
                            ? "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                            : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {theme === "light" ? "Dark mode" : "Light mode"}
                    </button>
                    <button
                        type="button"
                        onClick={clearBoard}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors text-red-500 ${
                        isDark ? "bg-slate-800 border-slate-600 hover:bg-slate-700" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div
                ref={wrapperRef}
                className="relative flex-1 w-full touch-none cursor-crosshair overflow-hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="wb-arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6 Z" fill="currentColor" />
                        </marker>
                    </defs>

                    {shapes.map((s) => (
                        <ShapeElement key={s.id} shape={s} onDelete={deleteShape} onDragStart={startDrag} />
                    ))}

                    {draftShape && <ShapePreview draft={draftShape} color={color} strokeWidth={strokeWidth} />}
                </svg>

                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {textBoxes.map((t) => (
                        <div
                        key={t.id}
                        className="absolute cursor-move pointer-events-auto"
                        style={{ left: t.x, top: t.y, color: t.color }}
                        onPointerDown={(e) => startDrag(e, t.id, "text")}
                        >
                        <textarea
                            value={t.text}
                            placeholder="Type here..."
                            onChange={(e) =>
                            setTextBoxes((prev) => prev.map((x) => (x.id === t.id ? { ...x, text: e.target.value } : x)))
                            }
                            onPointerDown={(e) => e.stopPropagation()}
                            className="min-w-35 min-h-8 border border-dashed border-slate-400 bg-transparent text-sm p-1 font-inherit resize"
                        />
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => deleteText(t.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-xs leading-none flex items-center justify-center"
                        >
                            x
                        </button>
                        </div>
                    ))}

                    {stickyNotes.map((n) => (
                        <div
                        key={n.id}
                        className="absolute w-40 min-h-30 rounded-md shadow-md p-2 cursor-move pointer-events-auto"
                        style={{ left: n.x, top: n.y, background: n.color }}
                        onPointerDown={(e) => startDrag(e, n.id, "sticky")}
                        >
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => deleteSticky(n.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 text-white text-xs leading-none flex items-center justify-center"
                        >
                            x
                        </button>
                        <textarea
                            value={n.text}
                            placeholder="Note..."
                            onChange={(e) =>
                            setStickyNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, text: e.target.value } : x)))
                            }
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-full h-24 border-none bg-transparent resize-none text-sm text-gray-900 focus:outline-none"
                        />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const ShapeElement = ({ shape, onDelete, onDragStart }) => {
    const common = {
        onPointerDown: (e) => onDragStart(e, shape.id, "shape"),
        onDoubleClick: () => onDelete(shape.id),
        style: { cursor: "move", pointerEvents: shape.type === "rectangle" ? "all" : "stroke" },
    };

    if (shape.type === "rectangle") {
        return (
            <rect
                x={shape.x}
                y={shape.y}
                width={shape.w}
                height={shape.h}
                fill="none"
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                rx={6}
                {...common}
            />
        );
    }

    if (shape.type === "circle") {
        return (
            <ellipse
                cx={shape.x + shape.w / 2}
                cy={shape.y + shape.h / 2}
                rx={shape.w / 2}
                ry={shape.h / 2}
                fill="none"
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                {...common}
            />
        );
    }

    if (shape.type === "arrow") {
        return (
            <line
                x1={shape.startX}
                y1={shape.startY}
                x2={shape.endX}
                y2={shape.endY}
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                markerEnd="url(#wb-arrowhead)"
                color={shape.color}
                {...common}
            />
        );
    }

    return null;
}

const ShapePreview = ({ draft, color, strokeWidth }) => {
    if (draft.type === "rectangle") {
        return (
            <rect
                x={draft.x}
                y={draft.y}
                width={draft.w}
                height={draft.h}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                rx={6}
                strokeDasharray="4 3"
            />
        );
    }

    if (draft.type === "circle") {
        return (
            <ellipse
                cx={draft.x + draft.w / 2}
                cy={draft.y + draft.h / 2}
                rx={draft.w / 2}
                ry={draft.h / 2}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray="4 3"
            />
        );
    }

    if (draft.type === "arrow") {
        return (
            <line
                x1={draft.startX}
                y1={draft.startY}
                x2={draft.endX}
                y2={draft.endY}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray="4 3"
            />
        );
    }
    return null;
}