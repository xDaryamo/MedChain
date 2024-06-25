/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

const ProceduresForm = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  return (
    <div>
      <h3>Procedures</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {/* Subject */}
          <FormRow label="Subject Reference:">
            <FormInput
              {...register(`procedures.${index}.subject.reference`, {
                required: "Subject reference is required",
              })}
              placeholder="Patient/67890"
            />
          </FormRow>
          <FormRow label="Subject Display:">
            <FormInput
              {...register(`procedures.${index}.subject.display`, {
                required: "Subject display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>

          {/* Code */}
          <FormRow label="Code System:">
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].system`, {
                required: "Code system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Code Value:">
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].code`, {
                required: "Code value is required",
              })}
              placeholder="80146002"
            />
          </FormRow>
          <FormRow label="Code Display:">
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].display`, {
                required: "Code display is required",
              })}
              placeholder="Appendectomy"
            />
          </FormRow>
          <FormRow label="Code Text:">
            <FormInput
              {...register(`procedures.${index}.code.text`, {
                required: "Code text is required",
              })}
              placeholder="Appendectomy"
            />
          </FormRow>

          {/* Status */}
          <FormRow label="Status System:">
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].system`, {
                required: "Status system is required",
              })}
              placeholder="http://terminology.hl7.org/CodeSystem/event-status"
            />
          </FormRow>
          <FormRow label="Status Code:">
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].code`, {
                required: "Status code is required",
              })}
              placeholder="completed"
            />
          </FormRow>
          <FormRow label="Status Display:">
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].display`, {
                required: "Status display is required",
              })}
              placeholder="Completed"
            />
          </FormRow>
          <FormRow label="Status Text:">
            <FormInput
              {...register(`procedures.${index}.status.text`, {
                required: "Status text is required",
              })}
              placeholder="Completed"
            />
          </FormRow>

          {/* Category */}
          <FormRow label="Category System:">
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].system`, {
                required: "Category system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Category Code:">
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].code`, {
                required: "Category code is required",
              })}
              placeholder="387713003"
            />
          </FormRow>
          <FormRow label="Category Display:">
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].display`, {
                required: "Category display is required",
              })}
              placeholder="Surgical procedure"
            />
          </FormRow>
          <FormRow label="Category Text:">
            <FormInput
              {...register(`procedures.${index}.category.text`, {
                required: "Category text is required",
              })}
              placeholder="Surgical procedure"
            />
          </FormRow>

          {/* Performed Period */}
          <FormRow label="Performed Start:">
            <FormInput
              type="datetime-local"
              {...register(`procedures.${index}.performedPeriod.start`, {
                required: "Performed start is required",
              })}
            />
          </FormRow>
          <FormRow label="Performed End:">
            <FormInput
              type="datetime-local"
              {...register(`procedures.${index}.performedPeriod.end`, {
                required: "Performed end is required",
              })}
            />
          </FormRow>

          {/* Performer */}
          <FormRow label="Performer Actor Reference:">
            <FormInput
              {...register(
                `procedures.${index}.performer.[0].actor.reference`,
                {
                  required: "Performer actor reference is required",
                },
              )}
              placeholder="Practitioner/123"
            />
          </FormRow>
          <FormRow label="Performer Actor Display:">
            <FormInput
              {...register(`procedures.${index}.performer.[0].actor.display`, {
                required: "Performer actor display is required",
              })}
              placeholder="Dr. Smith"
            />
          </FormRow>
          <FormRow label="Performer Role System:">
            <FormInput
              {...register(
                `procedures.${index}.performer.[0].role.coding.[0].system`,
                {
                  required: "Performer role system is required",
                },
              )}
              placeholder="http://terminology.hl7.org/CodeSystem/v2-0912"
            />
          </FormRow>
          <FormRow label="Performer Role Code:">
            <FormInput
              {...register(
                `procedures.${index}.performer.[0].role.coding.[0].code`,
                {
                  required: "Performer role code is required",
                },
              )}
              placeholder="PPRF"
            />
          </FormRow>
          <FormRow label="Performer Role Display:">
            <FormInput
              {...register(
                `procedures.${index}.performer.[0].role.coding.[0].display`,
                {
                  required: "Performer role display is required",
                },
              )}
              placeholder="Primary surgeon"
            />
          </FormRow>
          <FormRow label="Performer Role Text:">
            <FormInput
              {...register(`procedures.${index}.performer.[0].role.text`, {
                required: "Performer role text is required",
              })}
              placeholder="Primary surgeon"
            />
          </FormRow>

          {/* Encounter */}
          <FormRow label="Encounter Reference:">
            <FormInput
              {...register(`procedures.${index}.encounter.reference`, {
                required: "Encounter reference is required",
              })}
              placeholder="Encounter/345"
            />
          </FormRow>
          <FormRow label="Encounter Display:">
            <FormInput
              {...register(`procedures.${index}.encounter.display`, {
                required: "Encounter display is required",
              })}
              placeholder="Emergency department visit"
            />
          </FormRow>

          {/* Location */}
          <FormRow label="Location Reference:">
            <FormInput
              {...register(`procedures.${index}.location.reference`, {
                required: "Location reference is required",
              })}
              placeholder="Location/1"
            />
          </FormRow>
          <FormRow label="Location Display:">
            <FormInput
              {...register(`procedures.${index}.location.display`, {
                required: "Location display is required",
              })}
              placeholder="Operating Room 1"
            />
          </FormRow>

          {/* Reason Code */}
          <FormRow label="Reason Code System:">
            <FormInput
              {...register(
                `procedures.${index}.reasonCode.[0].coding.[0].system`,
                {
                  required: "Reason code system is required",
                },
              )}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Reason Code Value:">
            <FormInput
              {...register(
                `procedures.${index}.reasonCode.[0].coding.[0].code`,
                {
                  required: "Reason code value is required",
                },
              )}
              placeholder="233604007"
            />
          </FormRow>
          <FormRow label="Reason Code Display:">
            <FormInput
              {...register(
                `procedures.${index}.reasonCode.[0].coding.[0].display`,
                {
                  required: "Reason code display is required",
                },
              )}
              placeholder="Acute appendicitis"
            />
          </FormRow>
          <FormRow label="Reason Code Text:">
            <FormInput
              {...register(`procedures.${index}.reasonCode.[0].text`, {
                required: "Reason code text is required",
              })}
              placeholder="Acute appendicitis"
            />
          </FormRow>

          {/* Note */}
          <FormRow label="Note Author Reference:">
            <FormInput
              {...register(
                `procedures.${index}.note.[0].authorReference.reference`,
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
                `procedures.${index}.note.[0].authorReference.display`,
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
              {...register(`procedures.${index}.note.[0].time`, {
                required: "Note time is required",
              })}
            />
          </FormRow>
          <FormRow label="Note Text:">
            <FormInput
              {...register(`procedures.${index}.note.[0].text`, {
                required: "Note text is required",
              })}
              placeholder="Procedure was successful with no complications."
            />
          </FormRow>

          {/* Follow-up */}
          <FormRow label="Follow-up System:">
            <FormInput
              {...register(
                `procedures.${index}.followUp.[0].coding.[0].system`,
                {
                  required: "Follow-up system is required",
                },
              )}
              placeholder="http://terminology.hl7.org/CodeSystem/v2-0936"
            />
          </FormRow>
          <FormRow label="Follow-up Code:">
            <FormInput
              {...register(`procedures.${index}.followUp.[0].coding.[0].code`, {
                required: "Follow-up code is required",
              })}
              placeholder="F01"
            />
          </FormRow>
          <FormRow label="Follow-up Display:">
            <FormInput
              {...register(
                `procedures.${index}.followUp.[0].coding.[0].display`,
                {
                  required: "Follow-up display is required",
                },
              )}
              placeholder="Follow-up visit"
            />
          </FormRow>
          <FormRow label="Follow-up Text:">
            <FormInput
              {...register(`procedures.${index}.followUp.[0].text`, {
                required: "Follow-up text is required",
              })}
              placeholder="Follow-up visit in 2 weeks"
            />
          </FormRow>

          {/* Report */}
          <FormRow label="Report Reference:">
            <FormInput
              {...register(`procedures.${index}.report.[0].reference`, {
                required: "Report reference is required",
              })}
              placeholder="DiagnosticReport/5678"
            />
          </FormRow>
          <FormRow label="Report Display:">
            <FormInput
              {...register(`procedures.${index}.report.[0].display`, {
                required: "Report display is required",
              })}
              placeholder="Post-operative pathology report"
            />
          </FormRow>

          {/* Complication */}
          <FormRow label="Complication System:">
            <FormInput
              {...register(
                `procedures.${index}.complication.[0].coding.[0].system`,
                {
                  required: "Complication system is required",
                },
              )}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Complication Code:">
            <FormInput
              {...register(
                `procedures.${index}.complication.[0].coding.[0].code`,
                {
                  required: "Complication code is required",
                },
              )}
              placeholder="116223007"
            />
          </FormRow>
          <FormRow label="Complication Display:">
            <FormInput
              {...register(
                `procedures.${index}.complication.[0].coding.[0].display`,
                {
                  required: "Complication display is required",
                },
              )}
              placeholder="Postoperative wound infection"
            />
          </FormRow>
          <FormRow label="Complication Text:">
            <FormInput
              {...register(`procedures.${index}.complication.[0].text`, {
                required: "Complication text is required",
              })}
              placeholder="Postoperative wound infection"
            />
          </FormRow>

          {/* Body Site */}
          <FormRow label="Body Site System:">
            <FormInput
              {...register(
                `procedures.${index}.bodySite.[0].coding.[0].system`,
                {
                  required: "Body site system is required",
                },
              )}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow label="Body Site Code:">
            <FormInput
              {...register(`procedures.${index}.bodySite.[0].coding.[0].code`, {
                required: "Body site code is required",
              })}
              placeholder="66754008"
            />
          </FormRow>
          <FormRow label="Body Site Display:">
            <FormInput
              {...register(
                `procedures.${index}.bodySite.[0].coding.[0].display`,
                {
                  required: "Body site display is required",
                },
              )}
              placeholder="Appendix structure"
            />
          </FormRow>
          <FormRow label="Body Site Text:">
            <FormInput
              {...register(`procedures.${index}.bodySite.[0].text`, {
                required: "Body site text is required",
              })}
              placeholder="Appendix structure"
            />
          </FormRow>

          <Button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Remove procedure ${index + 1}`}
          >
            -
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({})}>
        Add Procedure
      </Button>
    </div>
  );
};

export default ProceduresForm;
