import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { analyzeLanguage } from '../utils/languageDetector';

export function TokenStats({ text, tokenData }) {
  const chars = analyzeLanguage(text);
  const totalTokens = tokenData.total;

  const koreanPercentage = totalTokens > 0 ? (tokenData.korean / totalTokens) * 100 : 0;
  const englishPercentage = totalTokens > 0 ? (tokenData.english / totalTokens) * 100 : 0;
  const otherPercentage = totalTokens > 0 ? (tokenData.other / totalTokens) * 100 : 0;

  const avgRatio = chars.total > 0 ? (totalTokens / chars.total).toFixed(2) : '0.00';

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
        📊 Token Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Tokens"
          value={totalTokens.toLocaleString()}
          subtitle="tokens"
          colorClass="text-blue-600 dark:text-blue-400"
        />

        <StatCard
          label="Total Characters"
          value={chars.total.toLocaleString()}
          subtitle="characters"
          colorClass="text-violet-600 dark:text-violet-400"
        />

        <StatCard
          label="Token/Char Ratio"
          value={avgRatio}
          subtitle="average"
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {totalTokens > 0 && (
        <div className="p-6 rounded-lg
                       bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
            Language Breakdown
          </h3>

          <ProgressBar
            percentage={koreanPercentage}
            label={`🇰🇷 Korean (${tokenData.korean.toLocaleString()} tokens)`}
            color="bg-gradient-to-r from-blue-500 to-violet-500"
          />

          <ProgressBar
            percentage={englishPercentage}
            label={`🇺🇸 English (${tokenData.english.toLocaleString()} tokens)`}
            color="bg-emerald-500"
          />

          <ProgressBar
            percentage={otherPercentage}
            label={`🔢 Other (${tokenData.other.toLocaleString()} tokens)`}
            color="bg-gray-400"
          />
        </div>
      )}

      {tokenData.isCalculating && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Calculating tokens...
        </div>
      )}
    </div>
  );
}
