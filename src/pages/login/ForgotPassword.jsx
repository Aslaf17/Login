import { Mail, KeyRound, ShieldCheck, CheckCircle2, ArrowLeft, Clock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value) => {
    if (!value.trim()) return "Email address is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
    return "";
};

const steps = [
    { label: "Verify Email", icon: Mail },
    { label: "Reset Password", icon: KeyRound },
];

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (touched) setError(validateEmail(value));
        if (apiError) setApiError("");
    };

    const handleBlur = () => {
        setTouched(true);
        setError(validateEmail(email));
    };

    const handleSubmit = (e) => {
        setTouched(true);
        e.preventDefault();
        setApiError("");

        const validationError = validateEmail(email);
        setError(validationError);
        if (validationError) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 400);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#0a0a14] p-4 overflow-hidden">
            <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-6">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const active = idx === 0;
                        return (
                            <div key={step.label} className="flex items-center gap-2">
                                <div
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                        active
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/40"
                                            : "bg-white/5 text-gray-500 border border-white/10"
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {step.label}
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="w-6 h-px bg-white/10" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 p-8">
                    {sent ? (
                        <div className="text-center py-2">
                            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1.5">Code sent!</h2>
                            <p className="text-sm text-gray-400 mb-1">
                                Check{" "}
                                <span className="font-semibold text-gray-200">{email}</span> for
                                your reset code.
                            </p>
                            <div className="inline-flex items-center gap-1.5 mt-2 mb-6 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                Expires in 10 minutes
                            </div>

                            <Link
                                to="/reset-password"
                                state={{ email: email.trim() }}
                                className="flex items-center justify-center w-full h-11 rounded-xl bg-white hover:bg-gray-100 active:scale-[0.98] text-gray-900 text-sm font-semibold transition"
                            >
                                Continue
                            </Link>

                            <button
                                type="button"
                                onClick={() => setSent(false)}
                                className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                Didn't get it? Resend
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/40 -rotate-3">
                                    <ShieldCheck className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white text-center mb-1.5">
                                Trouble signing in?
                            </h2>
                            <p className="text-sm text-gray-400 text-center mb-7 leading-relaxed">
                                Enter your email address and we'll send a verification code
                                to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="name@mail.com"
                                            autoComplete="email"
                                            aria-invalid={!!error}
                                            aria-describedby={error ? "email-error" : undefined}
                                            className={`w-full h-12 pl-10 pr-4 text-sm border-2 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none transition focus:bg-white/[0.07] ${
                                                error
                                                    ? "border-red-500/50 focus:border-red-500"
                                                    : "border-transparent focus:border-blue-500"
                                            }`}
                                        />
                                    </div>
                                    {error && (
                                        <p id="email-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                {apiError && (
                                    <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-400">
                                        {apiError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Sending code…
                                        </>
                                    ) : (
                                        "Send Code"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {!sent && (
                    <Link
                        to="/login"
                        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-300 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;