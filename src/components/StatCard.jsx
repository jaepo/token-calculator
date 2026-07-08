export function StatCard({ label, value, subtitle, icon, colorClass = "text-blue-600 dark:text-blue-400" }) {
  return (
    <div className="p-4 rounded-lg
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </div>
          <div className={`text-2xl font-bold ${colorClass}`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div className={`text-3xl ${colorClass}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
