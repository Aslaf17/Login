import { ClassroomChat } from "../../components/ClassroomChat";
import { Whiteboard } from "../../components/WhiteBoard";


export default function DigitalClassroom() {
    return (
        <div className="flex items-stretch gap-4 w-full bg-blue-200 h-screen p-5  max-[900px]:flex-col max-[900px]:h-auto max-[900px]:min-h-screen">
        <section
            className="relative w-[75%] flex-[0_0_75%] bg-blue-100 shadow-2xl border border-gray-200 rounded-2xl p-5
                flex flex-col overflow-hidden
                max-[900px]:w-full max-[900px]:flex-[1_1_auto]"
            >
            <h2 className="self-start m-0 mb-3.5 text-base  font-bold text-gray-900">
                 Whiteboard Development Sandbox
            </h2>
            <Whiteboard />
        </section>

        <aside
            className="w-[25%] flex min-w-80 bg-white border border-gray-200 rounded-2xl
                overflow-hidden flex flex-col shadow-2xl
                max-[900px]:w-full max-[900px]:flex-[1_1_auto] max-[900px]:min-h-90"
        >
            <ClassroomChat />
        </aside>
        </div>
    );
}