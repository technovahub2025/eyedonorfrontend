import './ProgressStepper.css';

function ProgressStepper({ steps, currentStep = 1 }) {
  return (
    <nav className="progress-stepper" aria-label="Progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const state =
          stepNumber < currentStep ? 'complete' : stepNumber === currentStep ? 'active' : 'pending';

        return (
          <div className="progress-stepper__item" key={step.label}>
            <div className={`progress-stepper__circle progress-stepper__circle--${state}`}>
              {state === 'complete' ? (
                <span className="material-symbols-outlined" aria-hidden="true">
                  check
                </span>
              ) : (
                <span className="progress-stepper__number">{String(stepNumber).padStart(2, '0')}</span>
              )}
            </div>
            <span className={`progress-stepper__label progress-stepper__label--${state}`}>
              {step.label}
            </span>

            {index < steps.length - 1 ? (
              <div
                className={`progress-stepper__line ${
                  stepNumber < currentStep ? 'progress-stepper__line--complete' : ''
                }`}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export default ProgressStepper;
