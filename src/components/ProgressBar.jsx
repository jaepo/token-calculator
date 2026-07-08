export function ProgressBar({ percentage, label, color = "bg-blue-500" }) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {safePercentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
