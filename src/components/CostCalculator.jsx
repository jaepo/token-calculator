import { OutputSlider } from './OutputSlider';
import { calculateCost, formatCost } from '../utils/costCalculator';
import { MODELS } from '../utils/constants';

export function CostCalculator({ inputTokens, outputTokens, onOutputChange, selectedModel }) {
  const model = MODELS.find(m => m.id === selectedModel);
  const cost = calculateCost(inputTokens, outputTokens, model);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
        💰 Cost Estimation
      </h2>

      <div className="p-6 rounded-lg
                     bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700
                     transition-colors duration-200">

        <OutputSlider
          value={outputTokens}
          onChange={onOutputChange}
          max={5000}
        />

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Input Cost ({inputTokens.toLocaleString()} tokens × ${model?.pricing.input}/1K)
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {formatCost(cost.input)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Output Cost (~{outputTokens.toLocaleString()} tokens × ${model?.pricing.output}/1K)
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {formatCost(cost.output)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 mt-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Total Cost
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCost(cost.total)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ≈ {formatCost(cost.totalKRW, 'KRW')}
              </div>
            </div>
          </div>
        </div>

        {model && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            Model: {model.name} • {(model.contextWindow / 1000).toLocaleString()}K context • {model.provider}
          </div>
        )}
      </div>
    </div>
  );
}
