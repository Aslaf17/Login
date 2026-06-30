export const Field = ({ label, name, value, onChange, onBlur, error, type = "text", autoComplete }) => {
    return (
        <div className="flex-1">
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete={autoComplete}
                aria-invalid={!!error}
                aria-describedby={`${name}-error`}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
                }`}
            />
            {error && (
                <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
                {error}
                </p>
            )}
        </div>
    );
}