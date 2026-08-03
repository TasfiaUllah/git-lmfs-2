import "./StepperHeader.css";

function StepperHeader({ steps, currentStep }) {
  return (
    <div className="cf-stepper">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div className="cf-stepper-item" key={step.title}>
            <div className="cf-stepper-node">
              <div
                className={`cf-stepper-circle ${
                  isActive ? "active" : isDone ? "done" : ""
                }`}
              >
                {stepNum}
              </div>
              <div className="cf-stepper-labels">
                <span className="cf-stepper-title">{step.title}</span>
                <span className="cf-stepper-subtitle">{step.subtitle}</span>
              </div>
            </div>
            {stepNum < steps.length && (
              <div
                className={`cf-stepper-line ${isDone ? "done" : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepperHeader;