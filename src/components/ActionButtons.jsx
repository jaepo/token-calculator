import { FiCopy, FiTrash2, FiFileText } from 'react-icons/fi';
import { SAMPLE_TEXTS } from '../utils/constants';

export function ActionButtons({ onCopy, onClear, onSample }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-blue-600 dark:bg-blue-500
                   text-white font-medium
                   hover:bg-blue-700 dark:hover:bg-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-colors duration-200"
      >
        <FiCopy className="w-4 h-4" />
        Copy Text
      </button>

      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-red-600 dark:bg-red-500
                   text-white font-medium
                   hover:bg-red-700 dark:hover:bg-red-600
                   focus:outline-none focus:ring-2 focus:ring-red-500
                   transition-colors duration-200"
      >
        <FiTrash2 className="w-4 h-4" />
        Clear
      </button>

      <div className="relative group">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-emerald-600 dark:bg-emerald-500
                     text-white font-medium
                     hover:bg-emerald-700 dark:hover:bg-emerald-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     transition-colors duration-200"
        >
          <FiFileText className="w-4 h-4" />
          Sample
        </button>

        <div className="absolute top-full left-0 mt-2 w-48 py-2
                       bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       rounded-lg shadow-lg
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible
                       transition-all duration-200 z-10">
          <button
            onClick={() => onSample(SAMPLE_TEXTS.korean)}
            className="w-full px-4 py-2 text-left text-sm
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-150"
          >
            한글 샘플
          </button>
          <button
            onClick={() => onSample(SAMPLE_TEXTS.english)}
            className="w-full px-4 py-2 text-left text-sm
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-150"
          >
            English Sample
          </button>
          <button
            onClick={() => onSample(SAMPLE_TEXTS.chinese)}
            className="w-full px-4 py-2 text-left text-sm
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-150"
          >
            中文样本 (简体)
          </button>
          <button
            onClick={() => onSample(SAMPLE_TEXTS.mixed)}
            className="w-full px-4 py-2 text-left text-sm
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors duration-150"
          >
            Mixed Sample
          </button>
        </div>
      </div>
    </div>
  );
}
