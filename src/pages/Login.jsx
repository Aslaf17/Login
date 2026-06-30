import { GraduationCap, Lightbulb, TrendingUp, Grid, BookOpen, BarChart3, Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: <Lightbulb className="w-4 h-4" />,
        label: "Smart Learning",
    },
    {
        icon: <TrendingUp className="w-4 h-4" />,
        label: "Track Progress",
    },
    {
        icon: <Grid className="w-4 h-4" />,
        label: "AI Assistance",
    },
];

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">

                <div
                    className="hidden md:flex flex-col justify-between flex-1 p-10 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #1a1a6e 0%, #2d2d9e 40%, #1a4fa8 70%, #0d3b7a 100%)",
                    }}
                >

                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/4 pointer-events-none" />

                    <div className="relative z-10">

                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 text-white">
                            <GraduationCap />
                            <span className="text-sm font-medium text-blue-200 tracking-wide">AI Education</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                            Empowering Minds<br />with AI Education
                        </h1>

                        <p className="text-sm text-blue-300 leading-relaxed max-w-xs">
                            A smarter way to learn — adaptive, personal, and powered by AI to help you grow at your own pace.
                        </p>

                        {/* Features */}
                        <div className="flex flex-col gap-3 mt-8">
                            {features.map((f) => (
                                <div key={f.label} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-sky-300 shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-sm font-medium text-blue-100">{f.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 h-36 mt-6" aria-hidden="true">
                        
                        <div className="absolute left-7 top-6 w-9 h-9 rounded-xl bg-blue-400/30 border border-blue-400/50 flex items-center justify-center text-blue-300">
                        <   BookOpen className="w-4 h-4" />
                        </div>

                        <div className="absolute left-24 top-12 w-9 h-9 rounded-xl bg-purple-400/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
                            <BarChart3 className="w-4 h-4" />
                        </div>

                        <div className="absolute left-44 top-5 w-9 h-9 rounded-xl bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                            <Grid className="w-4 h-4" />
                        </div>

                        <div className="absolute bottom-0 left-4 flex gap-10">
                        {["Learn", "Grow", "Thrive"].map((l) => (
                            <span key={l} className="text-[10px] text-white/40 tracking-wide">{l}</span>
                        ))}
                        </div>
                    </div>            
                </div>

                <div className="flex-1 md:flex-none md:w-96 bg-white flex items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <div className="flex md:hidden items-center gap-2 mb-6">
                                <Zap className="w-5 h-5 text-blue-700" />
                                <span className="text-sm font-semibold text-blue-700 tracking-wide">AI Education</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                            <p className="text-sm text-gray-500">Sign in to continue your learning journey</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Email address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@mail.com"
                                        autoComplete="email"
                                        required
                                        className="w-full h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full h-10 pl-9 pr-10 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                        ) : (
                                        <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-10 rounded-lg bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <hr className="flex-1 border-gray-200" />
                            <span className="text-xs text-gray-400">or</span>
                            <hr className="flex-1 border-gray-200" />
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;