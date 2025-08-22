import { Check, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface Step {
  id: string;
  title: string;
  description?: string;
  status: "idle" | "loading" | "success" | "error";
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onFinish?: () => void;
  nextDisabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Stepper({ 
  steps, 
  currentStep, 
  onNext, 
  onBack, 
  onFinish, 
  nextDisabled = false,
  loading = false,
  className = "" 
}: StepperProps) {
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  return (
    <div className={`card ${className}`} aria-live="polite">
      {/* Step Indicators */}
      <nav aria-label="Progress">
        <ol className="flex items-center gap-2 mb-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isUpcoming = index > currentStep;

            return (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium
                      ${isCompleted 
                        ? 'border-success text-success' 
                        : isActive 
                        ? 'border-primary text-primary' 
                        : 'border-border opacity-50'
                      }
                      ${isCompleted ? 'bg-success/10' : isActive ? 'bg-primary/10' : 'bg-transparent'}
                    `}
                    style={{
                      borderColor: isCompleted 
                        ? 'var(--success)' 
                        : isActive 
                        ? 'var(--primary)' 
                        : 'var(--border)',
                      color: isCompleted 
                        ? 'var(--success)' 
                        : isActive 
                        ? 'var(--primary)' 
                        : 'var(--warm-off-white)',
                      background: isCompleted 
                        ? 'rgba(60, 203, 127, 0.1)' 
                        : isActive 
                        ? 'rgba(91, 140, 255, 0.1)' 
                        : 'transparent'
                    }}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight 
                      className="h-4 w-4 mx-2" 
                      style={{color: isCompleted ? 'var(--success)' : 'rgba(248, 245, 242, 0.4)'}}
                      aria-hidden="true" 
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Current Step Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
          {currentStepData.description && (
            <p className="text-sm subtle mt-1">{currentStepData.description}</p>
          )}
        </div>

        {/* Step Status */}
        {currentStepData.status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-info">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-info border-t-transparent"></div>
            Processing...
          </div>
        )}

        {currentStepData.status === "error" && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <span>⚠️</span>
            An error occurred. Please try again.
          </div>
        )}

        {currentStepData.status === "success" && (
          <div className="flex items-center gap-2 text-sm text-success">
            <Check className="h-4 w-4" />
            Step completed successfully
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="secondary"
            onClick={onBack}
            disabled={currentStep === 0 || loading}
          >
            Back
          </Button>

          <Button
            onClick={isLastStep ? onFinish : onNext}
            disabled={nextDisabled || loading}
            loading={loading}
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
