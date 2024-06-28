/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";

const ProceduresForm = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const newInputRef = useRef(null);

  useEffect(() => {
    if (newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [fields]);

  const handleAddProcedure = () => {
    append({});
    setTimeout(() => {
      if (newInputRef.current) {
        newInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <h4 className="text-lg font-medium">Procedure {index + 1}</h4>
          <FormRow
            label="Subject Reference:"
            error={errors?.procedures?.[index]?.subject?.reference?.message}
          >
            <FormInput
              {...register(`procedures.${index}.subject.reference`, {
                required: "Subject reference is required",
              })}
              placeholder="Patient/67890"
              ref={index === fields.length - 1 ? newInputRef : null}
            />
          </FormRow>
          <FormRow
            label="Subject Display:"
            error={errors?.procedures?.[index]?.subject?.display?.message}
          >
            <FormInput
              {...register(`procedures.${index}.subject.display`, {
                required: "Subject display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>

          {/* Code */}
          <FormRow
            label="Code System:"
            error={
              errors?.procedures?.[index]?.code?.coding?.[0]?.system?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].system`, {
                required: "Code system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow
            label="Code Value:"
            error={
              errors?.procedures?.[index]?.code?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].code`, {
                required: "Code value is required",
              })}
              placeholder="80146002"
            />
          </FormRow>
          <FormRow
            label="Code Display:"
            error={
              errors?.procedures?.[index]?.code?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.code.coding.[0].display`, {
                required: "Code display is required",
              })}
              placeholder="Appendectomy"
            />
          </FormRow>
          <FormRow
            label="Code Text:"
            error={errors?.procedures?.[index]?.code?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.code.text`, {
                required: "Code text is required",
              })}
              placeholder="Appendectomy"
            />
          </FormRow>

          {/* Status */}
          <FormRow
            label="Status System:"
            error={
              errors?.procedures?.[index]?.status?.coding?.[0]?.system?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].system`, {
                required: "Status system is required",
              })}
              placeholder="http://terminology.hl7.org/CodeSystem/event-status"
            />
          </FormRow>
          <FormRow
            label="Status Code:"
            error={
              errors?.procedures?.[index]?.status?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].code`, {
                required: "Status code is required",
              })}
              placeholder="completed"
            />
          </FormRow>
          <FormRow
            label="Status Display:"
            error={
              errors?.procedures?.[index]?.status?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.status.coding.[0].display`, {
                required: "Status display is required",
              })}
              placeholder="Completed"
            />
          </FormRow>
          <FormRow
            label="Status Text:"
            error={errors?.procedures?.[index]?.status?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.status.text`, {
                required: "Status text is required",
              })}
              placeholder="Completed"
            />
          </FormRow>

          {/* Category */}
          <FormRow
            label="Category System:"
            error={
              errors?.procedures?.[index]?.category?.coding?.[0]?.system
                ?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].system`, {
                required: "Category system is required",
              })}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow
            label="Category Code:"
            error={
              errors?.procedures?.[index]?.category?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].code`, {
                required: "Category code is required",
              })}
              placeholder="387713003"
            />
          </FormRow>
          <FormRow
            label="Category Display:"
            error={
              errors?.procedures?.[index]?.category?.coding?.[0]?.display
                ?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.category.coding.[0].display`, {
                required: "Category display is required",
              })}
              placeholder="Surgical procedure"
            />
          </FormRow>
          <FormRow
            label="Category Text:"
            error={errors?.procedures?.[index]?.category?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.category.text`, {
                required: "Category text is required",
              })}
              placeholder="Surgical procedure"
            />
          </FormRow>

          {/* Performed Period */}
          <FormRow
            label="Performed Start:"
            error={errors?.procedures?.[index]?.performedPeriod?.start?.message}
          >
            <FormInput
              type="datetime-local"
              {...register(`procedures.${index}.performedPeriod.start`, {
                required: "Performed start is required",
              })}
            />
          </FormRow>
          <FormRow
            label="Performed End:"
            error={errors?.procedures?.[index]?.performedPeriod?.end?.message}
          >
            <FormInput
              type="datetime-local"
              {...register(`procedures.${index}.performedPeriod.end`, {
                required: "Performed end is required",
              })}
            />
          </FormRow>

          {/* Performer */}
          <FormRow
            label="Performer Actor Reference:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.actor?.reference
                ?.message
            }
          >
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
          <FormRow
            label="Performer Actor Display:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.actor?.display
                ?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.performer.[0].actor.display`, {
                required: "Performer actor display is required",
              })}
              placeholder="Dr. Smith"
            />
          </FormRow>
          <FormRow
            label="Performer Role System:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.role?.coding?.[0]
                ?.system?.message
            }
          >
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
          <FormRow
            label="Performer Role Code:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.role?.coding?.[0]
                ?.code?.message
            }
          >
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
          <FormRow
            label="Performer Role Display:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.role?.coding?.[0]
                ?.display?.message
            }
          >
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
          <FormRow
            label="Performer Role Text:"
            error={
              errors?.procedures?.[index]?.performer?.[0]?.role?.text?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.performer.[0].role.text`, {
                required: "Performer role text is required",
              })}
              placeholder="Primary surgeon"
            />
          </FormRow>

          {/* Encounter */}
          <FormRow
            label="Encounter Reference:"
            error={errors?.procedures?.[index]?.encounter?.reference?.message}
          >
            <FormInput
              {...register(`procedures.${index}.encounter.reference`, {
                required: "Encounter reference is required",
              })}
              placeholder="Encounter/345"
            />
          </FormRow>
          <FormRow
            label="Encounter Display:"
            error={errors?.procedures?.[index]?.encounter?.display?.message}
          >
            <FormInput
              {...register(`procedures.${index}.encounter.display`, {
                required: "Encounter display is required",
              })}
              placeholder="Emergency department visit"
            />
          </FormRow>

          {/* Location */}
          <FormRow
            label="Location Reference:"
            error={errors?.procedures?.[index]?.location?.reference?.message}
          >
            <FormInput
              {...register(`procedures.${index}.location.reference`, {
                required: "Location reference is required",
              })}
              placeholder="Location/1"
            />
          </FormRow>
          <FormRow
            label="Location Display:"
            error={errors?.procedures?.[index]?.location?.display?.message}
          >
            <FormInput
              {...register(`procedures.${index}.location.display`, {
                required: "Location display is required",
              })}
              placeholder="Operating Room 1"
            />
          </FormRow>

          {/* Reason Code */}
          <FormRow
            label="Reason Code System:"
            error={
              errors?.procedures?.[index]?.reasonCode?.[0]?.coding?.[0]?.system
                ?.message
            }
          >
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
          <FormRow
            label="Reason Code Value:"
            error={
              errors?.procedures?.[index]?.reasonCode?.[0]?.coding?.[0]?.code
                ?.message
            }
          >
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
          <FormRow
            label="Reason Code Display:"
            error={
              errors?.procedures?.[index]?.reasonCode?.[0]?.coding?.[0]?.display
                ?.message
            }
          >
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
          <FormRow
            label="Reason Code Text:"
            error={errors?.procedures?.[index]?.reasonCode?.[0]?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.reasonCode.[0].text`, {
                required: "Reason code text is required",
              })}
              placeholder="Acute appendicitis"
            />
          </FormRow>

          {/* Note */}
          <FormRow
            label="Note Author Reference:"
            error={
              errors?.procedures?.[index]?.note?.[0]?.authorReference?.reference
                ?.message
            }
          >
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
          <FormRow
            label="Note Author Display:"
            error={
              errors?.procedures?.[index]?.note?.[0]?.authorReference?.display
                ?.message
            }
          >
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
          <FormRow
            label="Note Time:"
            error={errors?.procedures?.[index]?.note?.[0]?.time?.message}
          >
            <FormInput
              type="datetime-local"
              {...register(`procedures.${index}.note.[0].time`, {
                required: "Note time is required",
              })}
            />
          </FormRow>
          <FormRow
            label="Note Text:"
            error={errors?.procedures?.[index]?.note?.[0]?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.note.[0].text`, {
                required: "Note text is required",
              })}
              placeholder="Procedure was successful with no complications."
            />
          </FormRow>

          {/* Follow-up */}
          <FormRow
            label="Follow-up System:"
            error={
              errors?.procedures?.[index]?.followUp?.[0]?.coding?.[0]?.system
                ?.message
            }
          >
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
          <FormRow
            label="Follow-up Code:"
            error={
              errors?.procedures?.[index]?.followUp?.[0]?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.followUp.[0].coding.[0].code`, {
                required: "Follow-up code is required",
              })}
              placeholder="F01"
            />
          </FormRow>
          <FormRow
            label="Follow-up Display:"
            error={
              errors?.procedures?.[index]?.followUp?.[0]?.coding?.[0]?.display
                ?.message
            }
          >
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
          <FormRow
            label="Follow-up Text:"
            error={errors?.procedures?.[index]?.followUp?.[0]?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.followUp.[0].text`, {
                required: "Follow-up text is required",
              })}
              placeholder="Follow-up visit in 2 weeks"
            />
          </FormRow>

          {/* Report */}
          <FormRow
            label="Report Reference:"
            error={errors?.procedures?.[index]?.report?.[0]?.reference?.message}
          >
            <FormInput
              {...register(`procedures.${index}.report.[0].reference`, {
                required: "Report reference is required",
              })}
              placeholder="DiagnosticReport/5678"
            />
          </FormRow>
          <FormRow
            label="Report Display:"
            error={errors?.procedures?.[index]?.report?.[0]?.display?.message}
          >
            <FormInput
              {...register(`procedures.${index}.report.[0].display`, {
                required: "Report display is required",
              })}
              placeholder="Post-operative pathology report"
            />
          </FormRow>

          {/* Complication */}
          <FormRow
            label="Complication System:"
            error={
              errors?.procedures?.[index]?.complication?.[0]?.coding?.[0]
                ?.system?.message
            }
          >
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
          <FormRow
            label="Complication Code:"
            error={
              errors?.procedures?.[index]?.complication?.[0]?.coding?.[0]?.code
                ?.message
            }
          >
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
          <FormRow
            label="Complication Display:"
            error={
              errors?.procedures?.[index]?.complication?.[0]?.coding?.[0]
                ?.display?.message
            }
          >
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
          <FormRow
            label="Complication Text:"
            error={
              errors?.procedures?.[index]?.complication?.[0]?.text?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.complication.[0].text`, {
                required: "Complication text is required",
              })}
              placeholder="Postoperative wound infection"
            />
          </FormRow>

          {/* Body Site */}
          <FormRow
            label="Body Site System:"
            error={
              errors?.procedures?.[index]?.bodySite?.[0]?.coding?.[0]?.system
                ?.message
            }
          >
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
          <FormRow
            label="Body Site Code:"
            error={
              errors?.procedures?.[index]?.bodySite?.[0]?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(`procedures.${index}.bodySite.[0].coding.[0].code`, {
                required: "Body site code is required",
              })}
              placeholder="66754008"
            />
          </FormRow>
          <FormRow
            label="Body Site Display:"
            error={
              errors?.procedures?.[index]?.bodySite?.[0]?.coding?.[0]?.display
                ?.message
            }
          >
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
          <FormRow
            label="Body Site Text:"
            error={errors?.procedures?.[index]?.bodySite?.[0]?.text?.message}
          >
            <FormInput
              {...register(`procedures.${index}.bodySite.[0].text`, {
                required: "Body site text is required",
              })}
              placeholder="Appendix structure"
            />
          </FormRow>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="delete"
              size="small"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleAddProcedure}
          variant="secondary"
          size="small"
        >
          <FaPlus className="mr-1" /> Add Procedure
        </Button>
      </div>
    </div>
  );
};

export default ProceduresForm;
