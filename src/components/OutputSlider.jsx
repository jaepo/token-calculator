export function OutputSlider({ value, onChange, max = 5000 }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="output-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Estimated Output Tokens
        </label>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {value.toLocaleString()} tokens
        </span>
      </div>

      <input
        id="output-slider"
        type="range"
        min="0"
        max={max}
        step="50"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer
                   bg-gray-200 dark:bg-gray-700
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-blue-600
                   [&::-webkit-slider-thumb]:dark:bg-blue-500
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-blue-600
                   [&::-moz-range-thumb]:dark:bg-blue-500
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>0</span>
        <span>{(max / 2).toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}
