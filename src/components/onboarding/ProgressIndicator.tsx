interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep
              ? 'w-8 bg-gradient-to-r from-nath-pink-400 to-nath-pink-500'
              : index < currentStep
                ? 'w-2 bg-nath-pink-300'
                : 'w-2 bg-claude-gray-200 dark:bg-claude-gray-700'
          }`}
          aria-label={`Step ${index + 1}${index === currentStep ? ' (current)' : index < currentStep ? ' (completed)' : ''}`}
        />
      ))}
    </div>
  );
};
