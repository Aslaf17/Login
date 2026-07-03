import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Field } from "../../components/Field.jsx";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordChecks = (password) => {
    return {
        length8: password.length >= 8,
        length12: password.length >= 12,
        length16: password.length >= 16,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(password),
        noRepeats: !/(.)\1{2,}/.test(password), 
    };
}

const getPasswordStrength = (password) => {
    if (!password) return { label: "", score: 0 };

    const checks = getPasswordChecks(password);

    if (!checks.length8) {
        return { label: "Weak", score: 0 };
    }

    let score = 0;
    if (checks.length8) score += 1;
    if (checks.length12) score += 1;
    if (checks.length16) score += 1;
    if (checks.upper) score += 1;
    if (checks.lower) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;
    if (checks.noRepeats) score += 1;

    const hasAllClasses = checks.upper && checks.lower && checks.number && checks.special;

    if (checks.length12 && hasAllClasses && checks.noRepeats && score >= 7) {
        return { label: "Strong", score };
    }

    if (checks.length8 && hasAllClasses) {
        return { label: "Medium", score };
    }

    return { label: "Weak", score };
    }

const validateField = (name, value, form) => {

    switch (name) {
        case "firstName":
            return value.trim() ? "" : "First name is required.";

        case "lastName":
            return value.trim() ? "" : "Last name is required.";

        case "email":
            if (!value.trim()) return "Email address is required.";
            if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
            return "";

        case "password": {
            if (!value) return "Password is required.";
            const checks = getPasswordChecks(value);
            if (!checks.length8) return "Password must be at least 8 characters."; // was checks.length
            if (!checks.upper) return "Password must include at least one uppercase letter.";
            if (!checks.lower) return "Password must include at least one lowercase letter.";
            if (!checks.number) return "Password must include at least one number.";
            if (!checks.special) return "Password must include at least one special character.";
            return "";
        }
        

        case "confirmPassword":
            if (!value) return "Please confirm your password.";
            if (value !== form.password) return "Passwords do not match.";
            return "";

        default:
            return "";
    }
    }

    const validateForm = (form) => {
        const errors = {};
        Object.keys(form).forEach((key) => {
            const err = validateField(key, form[key], form);
            if (err) errors[key] = err;
        });
        return errors;
    };

    async function submitRegistration(form) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        return { ok: true };
    }

    const strengthStyles = {
        Weak: { bar: "bg-red-500", text: "text-red-600", width: "33%" },
        Medium: { bar: "bg-amber-500", text: "text-amber-600", width: "66%" },
        Strong: { bar: "bg-green-500", text: "text-green-600", width: "100%" },
        "": { bar: "bg-gray-200", text: "text-gray-400", width: "0%" },
    };

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);
    const strengthStyle = strengthStyles[strength.label] || strengthStyles[""];

    function handleChange(e) {
        const { name, value } = e.target;
        const nextForm = { ...form, [name]: value };
        setForm(nextForm);

        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value, nextForm) }));
        }

        if (name === "password" && touched.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField("confirmPassword", nextForm.confirmPassword, nextForm),
            }));
        }
    }

    function handleBlur(e) {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name], form) }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");

        const allTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setTouched(allTouched);

        const formErrors = validateForm(form);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) return;

        setSubmitting(true);
        try {
        const result = await submitRegistration(form);
        if (result.ok) {
            setSubmitted(true);
            setTimeout(() => {
            navigate("/login", { replace: true, state: { justRegistered: true, email: form.email } });
            }, 900);
        } else {
            setSubmitError(result.message || "Registration failed. Please try again.");
        }
        } catch (err) {
        setSubmitError("Something went wrong. Please try again.");
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        
            <div className="w-full max-w-md bg-white rounded-r-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                <p className="mt-1 mb-6 text-sm text-gray-500">Fill in your details to get started.</p>

                {submitted ? (
                <div className="bg-green-100 text-green-800 text-sm font-semibold text-center rounded-lg px-4 py-3" role="status">
                    Account created. Redirecting to login...
                </div>
                ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Field
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.firstName ? errors.firstName : ""}
                            autoComplete="given-name"
                        />
                        <Field
                            label="Last Name"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName ? errors.lastName : ""}
                            autoComplete="family-name"
                        />
                    </div>

                    <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email ? errors.email : ""}
                    autoComplete="email"
                    />

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password
                        </label>    
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="new-password"
                                aria-invalid={!!(touched.password && errors.password)}
                                aria-describedby="password-error password-strength"
                                className={`w-full rounded-lg border px-3 py-2.5 pr-16 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    touched.password && errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {form.password && (
                            <div id="password-strength" className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                className={`h-full rounded-full transition-all duration-200 ${strengthStyle.bar}`}
                                style={{ width: strengthStyle.width }}
                                />
                            </div>
                            <span className={`text-xs font-bold min-w-48 text-right ${strengthStyle.text}`}>
                                {strength.label}
                            </span>
                            </div>
                        )}

                        {touched.password && errors.password && (
                            <p id="password-error" className="mt-1.5 text-xs text-red-600">
                            {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                            aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                            aria-describedby="confirmPassword-error"
                            className={`w-full rounded-lg border px-3 py-2.5 pr-16 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                touched.confirmPassword && errors.confirmPassword ? "border-red-500" : "border-gray-300"
                            }`}
                            />
                            <button
                            type="button"
                                onClick={() => setShowConfirmPassword((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {touched.confirmPassword && errors.confirmPassword && (
                            <p id="confirmPassword-error" className="mt-1.5 text-xs text-red-600">
                            {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {submitError && (
                    <div className="bg-red-100 text-red-800 text-sm rounded-lg px-3 py-2.5" role="alert">
                        {submitError}
                    </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg py-3 transition-colors cursor-pointer"
                        >
                        {submitting ? "Creating account..." : "Register"}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to= "/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
                )}
            </div>
        </div>
    );
}

export default Register;