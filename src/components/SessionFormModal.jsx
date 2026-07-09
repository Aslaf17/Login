import { useState } from "react";
import { X, BookOpen, User, Calendar, Clock, Timer, AlignLeft, CalendarPlus, Pencil } from "lucide-react";

const emptyForm = {
    sessionName: "",
    trainerName: "",
    date: "",
    time: "",
    duration: "",
    description: "",
};

const DESCRIPTION_LIMIT = 240;

const fieldBase = "w-full rounded-md border bg-white py-2.5 pl-10 pr-3 text-sm text-[#1C1917] outline-none transition placeholder:text-[#A8A29E] focus:border-[#7B2C2C] focus:ring-1 focus:ring-[#7B2C2C]";

const FieldIcon = ({ icon: Icon }) => {
    return (
        <Icon
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"
        />
    );
}

const FieldLabel = ({ children, required }) => {
    return (
        <label className="mb-1.5 block text-sm font-medium text-[#3F3A35]">
            {children} {required && <span className="text-[#7B2C2C]">*</span>}
        </label>
    );
}

const SectionHeading = ({ children }) => {
    return (
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9C948B]">
            <span className="h-px flex-1 bg-[#EEEAE4]" />
            {children}
            <span className="h-px flex-1 bg-[#EEEAE4]" />
        </p>
    );
}

export const SessionFormModal = ({ isOpen = true, onClose, onSave, initialData }) => {

    const [formData, setFormData] = useState(() =>
        initialData ? { ...emptyForm, ...initialData } : emptyForm
    );
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(initialData);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.sessionName.trim()) newErrors.sessionName = "Session name is required.";
        if (!formData.trainerName.trim()) newErrors.trainerName = "Trainer name is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        if (!formData.time) newErrors.time = "Time is required.";
        if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave(formData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[#E7E2DC] bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#E7E2DC] px-6 py-5">
                    <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEAEA] text-[#7B2C2C]">
                            {isEditMode ? <Pencil size={18} /> : <CalendarPlus size={18} />}
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-[#1C1917]">
                                {isEditMode ? "Edit Session" : "Add New Session"}
                            </h2>
                            <p className="mt-0.5 text-xs text-[#8A8580]">
                                {isEditMode
                                ? "Update the details for this training session."
                                : "Schedule a new training session for your team."}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded-md p-1.5 text-[#8A8580] transition hover:bg-[#F5F3F0] hover:text-[#1C1917]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    id="session-form"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto px-6 py-5"
                >
                    <div className="space-y-4">
                        <div>
                            <FieldLabel required>Session Name</FieldLabel>
                            <div className="relative">
                                <FieldIcon icon={BookOpen} />
                                <input
                                name="sessionName"
                                type="text"
                                value={formData.sessionName}
                                onChange={handleChange}
                                placeholder="e.g. React Fundamentals"
                                className={`${fieldBase} ${errors.sessionName ? "border-[#B91C1C]" : "border-[#E7E2DC]"}`}
                                />
                            </div>
                            {errors.sessionName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.sessionName}</p>}
                        </div>

                        <div>
                            <FieldLabel required>Trainer Name</FieldLabel>
                            <div className="relative">
                                <FieldIcon icon={User} />
                                <input
                                name="trainerName"
                                type="text"
                                value={formData.trainerName}
                                onChange={handleChange}
                                placeholder="e.g. bright"
                                className={`${fieldBase} ${errors.trainerName ? "border-[#B91C1C]" : "border-[#E7E2DC]"}`}
                                />
                            </div>
                            {errors.trainerName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.trainerName}</p>}
                        </div>
                    </div>

                    <SectionHeading>Schedule</SectionHeading>
                    <div className="rounded-lg border border-[#EEEAE4] bg-[#FAF9F7] p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel required>Date</FieldLabel>
                                <div className="relative">
                                <FieldIcon icon={Calendar} />
                                <input
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`${fieldBase} bg-white ${errors.date ? "border-[#B91C1C]" : "border-[#E7E2DC]"}`}
                                />
                                </div>
                                {errors.date && <p className="mt-1 text-xs text-[#B91C1C]">{errors.date}</p>}
                            </div>

                            <div>
                                <FieldLabel required>Time</FieldLabel>
                                <div className="relative">
                                    <FieldIcon icon={Clock} />
                                    <input
                                        name="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`${fieldBase} bg-white ${errors.time ? "border-[#B91C1C]" : "border-[#E7E2DC]"}`}
                                    />
                                </div>
                                {errors.time && <p className="mt-1 text-xs text-[#B91C1C]">{errors.time}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <FieldLabel required>Duration</FieldLabel>
                                <div className="relative">
                                    <FieldIcon icon={Timer} />
                                    <input
                                        name="duration"
                                        type="text"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g. 90 minutes"
                                        className={`${fieldBase} bg-white ${errors.duration ? "border-[#B91C1C]" : "border-[#E7E2DC]"}`}
                                    />
                                </div>
                                {errors.duration && <p className="mt-1 text-xs text-[#B91C1C]">{errors.duration}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="mb-1.5 flex items-center justify-between">
                            <FieldLabel>Description</FieldLabel>
                            <span className="text-xs text-[#A8A29E]">
                                {formData.description.length}/{DESCRIPTION_LIMIT}
                            </span>
                        </div>
                        <div className="relative">
                            <AlignLeft size={16} className="pointer-events-none absolute left-3 top-3 text-[#A8A29E]" />
                            <textarea
                                name="description"
                                rows={3}
                                maxLength={DESCRIPTION_LIMIT}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief agenda or notes for this session..."
                                className={`${fieldBase} resize-none border-[#E7E2DC] pt-2.5`}
                            />
                        </div>
                    </div>
                </form>

                <div className="flex justify-end gap-3 border-t border-[#E7E2DC] bg-white px-6 py-4 shadow-[0_-4px_10px_-8px_rgba(0,0,0,0.15)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-[#E7E2DC] bg-white px-4 py-2 text-sm font-medium text-[#3F3A35] transition hover:bg-[#F5F3F0]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="session-form"
                        className="rounded-md bg-[#7B2C2C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#651F1F]"
                    >
                        {isEditMode ? "Save Changes" : "Add Session"}
                    </button>
                </div>
            </div>
        </div>
    );
}

