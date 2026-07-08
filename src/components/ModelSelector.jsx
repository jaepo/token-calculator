import { MODELS } from '../utils/constants';

export function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="mb-6">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        AI Model
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        aria-label="Select AI model"
        className="w-full px-4 py-3 rounded-lg
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   text-gray-900 dark:text-gray-50
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-colors duration-200
                   cursor-pointer"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} ({model.provider}) - Input: ${model.pricing.input}/1K, Output: ${model.pricing.output}/1K
          </option>
        ))}
      </select>

      {MODELS.find(m => m.id === selectedModel) && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {MODELS.find(m => m.id === selectedModel).contextWindow.toLocaleString()} tokens context window
        </div>
      )}
    </div>
  );
}
