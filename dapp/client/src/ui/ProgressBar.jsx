/* eslint-disable react/prop-types */
import React from "react";

const ProgressBar = ({ currentStep, steps }) => {
  return (
    <div className="relative mb-4 flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep >= index + 1
                ? "bg-cyan-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 ${
                currentStep > index + 1 ? "bg-cyan-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
