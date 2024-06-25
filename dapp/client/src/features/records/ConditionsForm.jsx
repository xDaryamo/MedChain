/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

const ConditionsForm = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  return (
    <div>
      <h3>Conditions</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {/* Clinical Status */}
          <FormRow label="Clinical Status System:">
            <FormInput
              {...register(
                `conditions.${index}.clinicalStatus.coding.[0].system`,
                {
                  required: "Clinical status system is required",
                },
              )}
              placeholder="http://terminology.hl7.org/CodeSystem/condition-clinical"
            />
          </FormRow>
          <FormRow label="Clinical Status Code:">
            <FormInput
              {...register(
                `conditions.${index}.clinicalStatus.coding.[0].code`,
                {
                  required: "Clinical status code is required",
                },
              )}
              placeholder="active"
            />
          </FormRow>
          <FormRow label="Clinical Status Display:">
            <FormInput
              {...register(
                `conditions.${index}.clinicalStatus.coding.[0].display`,
                {
                  required: "Clinical status display is required",
                },
              )}
              placeholder="Active"
            />
          </FormRow>
          <FormRow label="Clinical Status Text:">
            <FormInput
              {...register(`conditions.${index}.clinicalStatus.text`, {
                required: "Clinical status text is required",
              })}
              placeholder="Active"
            />
          </FormRow>

          {/* Verification Status */}
          <FormRow label="Verification Status System:">
            <FormInput
              {...register(
                `conditions.${index}.verificationStatus.coding.[0].system`,
                {
                  required: "Verification status system is required",
                },
              )}
              placeholder="http://terminology.hl7.org/CodeSystem/condition-ver-status"
            />
          </FormRow>
          <FormRow label="Verification Status Code:">
            <FormInput
              {...register(
                `conditions.${index}.verificationStatus.coding.[0].code`,
                {
                  required: "Verification status code is required",
                },
              )}
              placeholder="confirmed"
            />
          </FormRow>
          <FormRow label="Verification Status Display:">
            <FormInput
              {...register(
                `conditions.${index}.verificationStatus.coding.[0].display`,
                {
                  required: "Verification status display is required",
                },
              )}
              placeholder="Confirmed"
            />
          </FormRow>
          <FormRow label="Verification Status Text:">
            <FormInput
              {...register(`conditions.${index}.verificationStatus.text`, {
                required: "Verification status text is required",
              })}
              placeholder="Confirmed"
            />
          </FormRow>

          {/* Category */}
          <FormRow label="Category System:">
            <FormInput
              {...register(
                `conditions.${index}.category.[0].coding.[0].system`,
                {
                  required: "Category system is required",
                },
              )}
              placeholder="http://terminology.hl7.org/CodeSystem/condition-category"
            />
          </FormRow>
          <FormRow label="Category Code:">
            <FormInput
              {...register(`conditions.${index}.category.[0].coding.[0].code`, {
                required: "Category code is required",
              })}
              placeholder="problem-list-item"
            />
          </FormRow>
          <FormRow label="Category Display:">
            <FormInput
              {...register(
                `conditions.${index}.category.[0].coding.[0].display`,
                {
                  required: "Category display is required",
                },
              )}
              placeholder="Problem List Item"
            />
          </FormRow>
          <FormRow label="Category Text:">
            <FormInput
              {...register(`conditions.${index}.category.[0].text`, {
                required: "Category text is required",
              })}
              placeholder="Problem List Item"
            />
          </FormRow>

          {/* Severity */}
          <FormRow label="Severity System:">
            <FormInput
              {...register(`conditions.${index}.severity.coding.[0].system`, {
                required: "Severity system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Severity Code:">
            <FormInput
              {...register(`conditions.${index}.severity.coding.[0].code`, {
                required: "Severity code is required",
              })}
              placeholder="24484000"
            />
          </FormRow>
          <FormRow label="Severity Display:">
            <FormInput
              {...register(`conditions.${index}.severity.coding.[0].display`, {
                required: "Severity display is required",
              })}
              placeholder="Severe"
            />
          </FormRow>
          <FormRow label="Severity Text:">
            <FormInput
              {...register(`conditions.${index}.severity.text`, {
                required: "Severity text is required",
              })}
              placeholder="Severe"
            />
          </FormRow>

          {/* Code */}
          <FormRow label="Code System:">
            <FormInput
              {...register(`conditions.${index}.code.coding.[0].system`, {
                required: "Code system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Code Value:">
            <FormInput
              {...register(`conditions.${index}.code.coding.[0].code`, {
                required: "Code value is required",
              })}
              placeholder="44054006"
            />
          </FormRow>
          <FormRow label="Code Display:">
            <FormInput
              {...register(`conditions.${index}.code.coding.[0].display`, {
                required: "Code display is required",
              })}
              placeholder="Diabetes mellitus type 2"
            />
          </FormRow>
          <FormRow label="Code Text:">
            <FormInput
              {...register(`conditions.${index}.code.text`, {
                required: "Code text is required",
              })}
              placeholder="Type 2 Diabetes Mellitus"
            />
          </FormRow>

          {/* Subject */}
          <FormRow label="Subject Reference:">
            <FormInput
              {...register(`conditions.${index}.subject.reference`, {
                required: "Subject reference is required",
              })}
              placeholder="Patient/67890"
            />
          </FormRow>
          <FormRow label="Subject Display:">
            <FormInput
              {...register(`conditions.${index}.subject.display`, {
                required: "Subject display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>

          {/* Onset DateTime */}
          <FormRow label="Onset DateTime:">
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.onsetDateTime`, {
                required: "Onset DateTime is required",
              })}
            />
          </FormRow>

          {/* Abatement DateTime */}
          <FormRow label="Abatement DateTime:">
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.abatementDateTime`, {
                required: "Abatement DateTime is required",
              })}
            />
          </FormRow>

          {/* Recorded Date */}
          <FormRow label="Recorded Date:">
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.recordedDate`, {
                required: "Recorded Date is required",
              })}
            />
          </FormRow>

          {/* Recorder */}
          <FormRow label="Recorder Reference:">
            <FormInput
              {...register(`conditions.${index}.recorder.reference`, {
                required: "Recorder reference is required",
              })}
              placeholder="Practitioner/123"
            />
          </FormRow>
          <FormRow label="Recorder Display:">
            <FormInput
              {...register(`conditions.${index}.recorder.display`, {
                required: "Recorder display is required",
              })}
              placeholder="Dr. Smith"
            />
          </FormRow>

          {/* Asserter */}
          <FormRow label="Asserter Reference:">
            <FormInput
              {...register(`conditions.${index}.asserter.reference`, {
                required: "Asserter reference is required",
              })}
              placeholder="Practitioner/123"
            />
          </FormRow>
          <FormRow label="Asserter Display:">
            <FormInput
              {...register(`conditions.${index}.asserter.display`, {
                required: "Asserter display is required",
              })}
              placeholder="Dr. Smith"
            />
          </FormRow>

          {/* Evidence */}
          <FormRow label="Evidence Code System:">
            <FormInput
              {...register(
                `conditions.${index}.evidence.[0].code.coding.[0].system`,
                {
                  required: "Evidence code system is required",
                },
              )}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Evidence Code:">
            <FormInput
              {...register(
                `conditions.${index}.evidence.[0].code.coding.[0].code`,
                {
                  required: "Evidence code is required",
                },
              )}
              placeholder="271807003"
            />
          </FormRow>
          <FormRow label="Evidence Display:">
            <FormInput
              {...register(
                `conditions.${index}.evidence.[0].code.coding.[0].display`,
                {
                  required: "Evidence display is required",
                },
              )}
              placeholder="Increased blood glucose level"
            />
          </FormRow>
          <FormRow label="Evidence Text:">
            <FormInput
              {...register(`conditions.${index}.evidence.[0].code.text`, {
                required: "Evidence text is required",
              })}
              placeholder="Increased blood glucose level"
            />
          </FormRow>
          <FormRow label="Evidence Detail Reference:">
            <FormInput
              {...register(
                `conditions.${index}.evidence.[0].detail.[0].reference`,
                {
                  required: "Evidence detail reference is required",
                },
              )}
              placeholder="Observation/789"
            />
          </FormRow>
          <FormRow label="Evidence Detail Display:">
            <FormInput
              {...register(
                `conditions.${index}.evidence.[0].detail.[0].display`,
                {
                  required: "Evidence detail display is required",
                },
              )}
              placeholder="Blood Glucose Measurement"
            />
          </FormRow>

          {/* Note */}
          <FormRow label="Note Author Reference:">
            <FormInput
              {...register(
                `conditions.${index}.note.[0].authorReference.reference`,
                {
                  required: "Note author reference is required",
                },
              )}
              placeholder="Practitioner/123"
            />
          </FormRow>
          <FormRow label="Note Author Display:">
            <FormInput
              {...register(
                `conditions.${index}.note.[0].authorReference.display`,
                {
                  required: "Note author display is required",
                },
              )}
              placeholder="Dr. Smith"
            />
          </FormRow>
          <FormRow label="Note Time:">
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.note.[0].time`, {
                required: "Note time is required",
              })}
            />
          </FormRow>
          <FormRow label="Note Text:">
            <FormInput
              {...register(`conditions.${index}.note.[0].text`, {
                required: "Note text is required",
              })}
              placeholder="Patient diagnosed with type 2 diabetes mellitus. Started on metformin."
            />
          </FormRow>

          <Button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Remove condition ${index + 1}`}
          >
            -
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({})}>
        Add Condition
      </Button>
    </div>
  );
};

export default ConditionsForm;
