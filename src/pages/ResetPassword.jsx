import {
    Mail,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/auth";

const steps = [
    { label: "Verify Email", icon: Mail },
    { label: "Reset Password", icon: KeyRound },
];

const validatePassword = (value) => {
    if (!value) return "New password is required.";
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Include at least one lowercase letter.";
    if (!/[0-9]/.test(value)) return "Include at least one number.";
    return "";
};

const validateConfirm = (password, confirm) => {
    if (!confirm) return "Please confirm your new password.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);

    const clearError = (field) => {
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
        if (apiError) setApiError("");
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        let message = "";
        if (field === "email") message = email.trim() ? "" : "Email address is required.";
        if (field === "newPassword") message = validatePassword(newPassword);
        if (field === "confirmPassword") message = validateConfirm(newPassword, confirmPassword);
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        const nextErrors = {
            email: email.trim() ? "" : "Email address is required.",
            newPassword: validatePassword(newPassword),
            confirmPassword: validateConfirm(newPassword, confirmPassword),
        };
        setErrors(nextErrors);
        setTouched({ email: true, newPassword: true, confirmPassword: true });

        if (Object.values(nextErrors).some(Boolean)) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: newPassword,
                }),
            });

            const text = await res.text();

            if (!res.ok || text !== "Password Changed Successfully") {
                throw new Error(text || "Failed to reset password. Please try again.");
            }

            setSuccess(true);
            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            setApiError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendCode = () => {
        setApiError("");
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

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 p-8">
                    {success ? (
                        <div className="text-center py-2">
                            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 rotate-3">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1.5">Password reset!</h2>
                            <p className="text-sm text-gray-400 mb-6">
                                Redirecting you to login…
                            </p>
                            <Link
                                to="/login"
                                className="flex items-center justify-center w-full h-11 rounded-xl bg-white hover:bg-gray-100 active:scale-[0.98] text-gray-900 text-sm font-semibold transition"
                            >
                                Go to login now
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/40 -rotate-3">
                                    <Lock className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white text-center mb-1.5">
                                Set a new password
                            </h2>
                            <p className="text-sm text-gray-400 text-center mb-7 leading-relaxed">
                                Enter the code we sent you along with your new password.
                            </p>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {/* Email (read-only if carried over, editable otherwise) */}
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
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                clearError("email");
                                            }}
                                            onBlur={() => handleBlur("email")}
                                            placeholder="name@mail.com"
                                            autoComplete="email"
                                            className={`w-full h-12 pl-10 pr-4 text-sm border-2 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none transition focus:bg-white/[0.07] ${
                                                touched.email && errors.email
                                                    ? "border-red-500/50 focus:border-red-500"
                                                    : "border-transparent focus:border-blue-500"
                                            }`}
                                        />
                                    </div>
                                    {touched.email && errors.email && (
                                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                {/* Verification code — no backend validation, plain input */}
                                <div>
                                    <label
                                        htmlFor="otp"
                                        className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                                    >
                                        Verification code
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <KeyRound className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="otp"
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="6-digit code"
                                            className="w-full h-12 pl-10 pr-4 text-sm tracking-[0.3em] border-2 border-transparent rounded-xl bg-white/5 text-white placeholder-gray-500 placeholder:tracking-normal outline-none transition focus:bg-white/[0.07] focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* New password */}
                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                                    >
                                        New password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                clearError("newPassword");
                                            }}
                                            onBlur={() => handleBlur("newPassword")}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            className={`w-full h-12 pl-10 pr-11 text-sm border-2 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none transition focus:bg-white/[0.07] ${
                                                touched.newPassword && errors.newPassword
                                                    ? "border-red-500/50 focus:border-red-500"
                                                    : "border-transparent focus:border-blue-500"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {touched.newPassword && errors.newPassword && (
                                        <p className="mt-1.5 text-xs text-red-400">{errors.newPassword}</p>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
                                    >
                                        Confirm new password
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                clearError("confirmPassword");
                                            }}
                                            onBlur={() => handleBlur("confirmPassword")}
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                            className={`w-full h-12 pl-10 pr-11 text-sm border-2 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none transition focus:bg-white/[0.07] ${
                                                touched.confirmPassword && errors.confirmPassword
                                                    ? "border-red-500/50 focus:border-red-500"
                                                    : "border-transparent focus:border-blue-500"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            aria-label={showConfirm ? "Hide password" : "Show password"}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                                        >
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
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
                                            Resetting…
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={resendCode}
                                className="mt-4 w-full text-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
                            >
                                Didn't get a code? Resend
                            </button>
                        </>
                    )}
                </div>

                {!success && (
                    <Link
                        to="/forgot-password"
                        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-300 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;