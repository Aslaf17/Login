import { useState } from "react";

export const ClassroomChat = () => {

    const [messages, setMessages] = useState([
        { id: 1, author: "Trainer", text: "Welcome to the session!" },
    ]);

     const [draft, setDraft] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();
        if (!draft.trim()) return;
        setMessages((prev) => [...prev, { id: prev.length + 1, author: "You", text: draft.trim() }]);
        setDraft("");
    };

    return (
        <div className="flex flex-col h-full">
            <header className="bg-blue-100 p-3.5 border-b border-gray-300">
                <h2 className="text-lg font-bold capitalize text-gray-900">Classroom Chat</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {messages.map((m) => {
                    const isTrainer = m.author === "Trainer";
                    return (
                        <div
                            key={m.id}
                            className={`max-w-[85%] rounded-lg px-2.5 py-2 ${
                                isTrainer
                                    ? "self-start bg-indigo-100 border-l-4 border-indigo-400"
                                    : "self-end bg-indigo-100 border-l-4 border-indigo-400"
                            }`}
                        >
                            <span
                                className={`text-[11px] font-bold ${
                                    isTrainer ? "text-amber-700" : "text-indigo-600"
                                }`}
                            >
                                {m.author}
                            </span>
                            <p className="mt-1 text-[13px] wrap-break-word text-gray-800">{m.text}</p>
                        </div>
                    );
                })}
            </div>
            <form className="flex gap-2 p-2.5 border-t border-gray-200" onSubmit={sendMessage}>
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Message the class..."
                    className="flex-1 px-2.5 py-2 rounded-md border border-gray-300 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="px-3 py-2 rounded-md bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700"
                >
                    Send
                </button>
            </form>
        </div>
    );
}