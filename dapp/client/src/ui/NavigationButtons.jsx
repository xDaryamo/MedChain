import BackButton from "./BackButton";
import NextButton from "./NextButton";

/* eslint-disable react/prop-types */
const NavigationButtons = ({
  step,
  handlePreviousStep,
  handleNextStep,
  isFinalStep,
}) => {
  return (
    <div className="end-0 col-span-2 mb-4 flex justify-between">
      {step > 1 && (
        <span className="mr-auto">
          <BackButton onClick={handlePreviousStep}>Indietro</BackButton>
        </span>
      )}
      {!isFinalStep && (
        <span className="ml-auto">
          <NextButton onClick={handleNextStep}>Avanti</NextButton>
        </span>
      )}
    </div>
  );
};

export default NavigationButtons;
