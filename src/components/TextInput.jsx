import { analyzeLanguage } from '../utils/languageDetector';

export function TextInput({ value, onChange }) {
  const chars = analyzeLanguage(value);
  const maxLength = 100000;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prompt
        </label>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {chars.total.toLocaleString()} / {maxLength.toLocaleString()} characters
        </span>
      </div>

      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="프롬프트를 입력하세요..."
        maxLength={maxLength}
        rows={10}
        className="w-full px-4 py-3 rounded-lg
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   text-gray-900 dark:text-gray-50
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-colors duration-200
                   resize-y min-h-[200px]"
      />

      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>한글: {chars.korean.toLocaleString()}</span>
        <span>영문: {chars.english.toLocaleString()}</span>
        <span>숫자: {chars.numbers.toLocaleString()}</span>
        <span>공백: {chars.spaces.toLocaleString()}</span>
      </div>
    </div>
  );
}
