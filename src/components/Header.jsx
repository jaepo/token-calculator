import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            🎯 AI Token Counter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            실시간 프롬프트 토큰 계산 및 비용 예측
          </p>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-3 rounded-lg transition-all duration-200
                     bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     border border-gray-200 dark:border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {theme === 'dark' ? (
            <FiSun className="w-6 h-6 text-yellow-500 transition-transform duration-200 hover:rotate-90" />
          ) : (
            <FiMoon className="w-6 h-6 text-blue-600 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
}
