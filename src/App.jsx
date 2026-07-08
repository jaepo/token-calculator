import { useState } from 'react';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { TextInput } from './components/TextInput';
import { ActionButtons } from './components/ActionButtons';
import { TokenStats } from './components/TokenStats';
import { CostCalculator } from './components/CostCalculator';
import { useTokenCount } from './hooks/useTokenCount';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useLocalStorage('selectedModel', 'gpt-4.1');
  const [estimatedOutputTokens, setEstimatedOutputTokens] = useLocalStorage('estimatedOutputTokens', 500);

  const tokenData = useTokenCount(inputText, selectedModel);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy text');
    }
  };

  const handleClear = () => {
    if (inputText && !confirm('Are you sure you want to clear the text?')) {
      return;
    }
    setInputText('');
  };

  const handleSample = (sampleText) => {
    setInputText(sampleText);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header />

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        <TextInput
          value={inputText}
          onChange={setInputText}
        />

        <ActionButtons
          onCopy={handleCopy}
          onClear={handleClear}
          onSample={handleSample}
        />

        <TokenStats
          text={inputText}
          tokenData={tokenData}
        />

        <CostCalculator
          inputTokens={tokenData.total}
          outputTokens={estimatedOutputTokens}
          onOutputChange={setEstimatedOutputTokens}
          selectedModel={selectedModel}
        />
      </div>
    </div>
  );
}

export default App;
