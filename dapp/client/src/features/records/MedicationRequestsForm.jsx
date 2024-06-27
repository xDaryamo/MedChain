/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

const MedicationRequestsForm = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicationRequests",
  });

  return (
    <div>
      <h3>Medication Requests</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4">
          {/* Medication Codeable Concept */}
          <FormRow
            label="Medication Code System:"
            error={
              errors?.medicationRequests?.[index]?.medicationCodeableConcept
                ?.coding?.[0]?.system?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.medicationCodeableConcept.coding[0].system`,
                {
                  required: "Medication code system is required",
                },
              )}
              placeholder="http://snomed.info/sct"
            />
          </FormRow>
          <FormRow
            label="Medication Code Value:"
            error={
              errors?.medicationRequests?.[index]?.medicationCodeableConcept
                ?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.medicationCodeableConcept.coding[0].code`,
                {
                  required: "Medication code value is required",
                },
              )}
              placeholder="80146002"
            />
          </FormRow>
          <FormRow
            label="Medication Code Display:"
            error={
              errors?.medicationRequests?.[index]?.medicationCodeableConcept
                ?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.medicationCodeableConcept.coding[0].display`,
                {
                  required: "Medication code display is required",
                },
              )}
              placeholder="Ibuprofen"
            />
          </FormRow>
          <FormRow
            label="Medication Code Text:"
            error={
              errors?.medicationRequests?.[index]?.medicationCodeableConcept
                ?.text?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.medicationCodeableConcept.text`,
                {
                  required: "Medication code text is required",
                },
              )}
              placeholder="Ibuprofen"
            />
          </FormRow>

          {/* Subject */}
          <FormRow
            label="Subject Reference:"
            error={
              errors?.medicationRequests?.[index]?.subject?.reference?.message
            }
          >
            <FormInput
              {...register(`medicationRequests.${index}.subject.reference`, {
                required: "Subject reference is required",
              })}
              placeholder="Patient/67890"
            />
          </FormRow>
          <FormRow
            label="Subject Display:"
            error={
              errors?.medicationRequests?.[index]?.subject?.display?.message
            }
          >
            <FormInput
              {...register(`medicationRequests.${index}.subject.display`, {
                required: "Subject display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>

          {/* Authored On */}
          <FormRow
            label="Authored On:"
            error={errors?.medicationRequests?.[index]?.authoredOn?.message}
          >
            <input
              type="datetime-local"
              {...register(`medicationRequests.${index}.authoredOn`, {
                required: "Authored On is required",
              })}
            />
          </FormRow>

          {/* Requester */}
          <FormRow
            label="Requester Reference:"
            error={
              errors?.medicationRequests?.[index]?.requester?.reference?.message
            }
          >
            <FormInput
              {...register(`medicationRequests.${index}.requester.reference`, {
                required: "Requester reference is required",
              })}
              placeholder="Practitioner/123"
            />
          </FormRow>
          <FormRow
            label="Requester Display:"
            error={
              errors?.medicationRequests?.[index]?.requester?.display?.message
            }
          >
            <FormInput
              {...register(`medicationRequests.${index}.requester.display`, {
                required: "Requester display is required",
              })}
              placeholder="Dr. Smith"
            />
          </FormRow>

          {/* Dosage Instruction */}
          <FormRow
            label="Dosage Instruction Text:"
            error={
              errors?.medicationRequests?.[index]?.dosageInstruction?.[0]?.text
                ?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.dosageInstruction[0].text`,
                {
                  required: "Dosage instruction text is required",
                },
              )}
              placeholder="Take 1 tablet twice daily"
            />
          </FormRow>

          {/* Dispense Request */}
          <FormRow
            label="Dispense Quantity:"
            error={
              errors?.medicationRequests?.[index]?.dispenseRequest?.quantity
                ?.value?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.dispenseRequest.quantity.value`,
                {
                  required: "Dispense quantity value is required",
                },
              )}
              placeholder="30"
            />
          </FormRow>
          <FormRow
            label="Dispense Quantity Unit:"
            error={
              errors?.medicationRequests?.[index]?.dispenseRequest?.quantity
                ?.unit?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.dispenseRequest.quantity.unit`,
                {
                  required: "Dispense quantity unit is required",
                },
              )}
              placeholder="tablets"
            />
          </FormRow>
          <FormRow
            label="Expected Supply Duration:"
            error={
              errors?.medicationRequests?.[index]?.dispenseRequest
                ?.expectedSupplyDuration?.value?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.dispenseRequest.expectedSupplyDuration.value`,
                {
                  required: "Expected supply duration value is required",
                },
              )}
              placeholder="7"
            />
          </FormRow>

          {/* Status */}
          <FormRow
            label="Status Code:"
            error={
              errors?.medicationRequests?.[index]?.status?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.status.coding[0].code`,
                {
                  required: "Status code is required",
                },
              )}
              placeholder="active"
            />
          </FormRow>
          <FormRow
            label="Status Display:"
            error={
              errors?.medicationRequests?.[index]?.status?.coding?.[0]?.display
                ?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.status.coding[0].display`,
                {
                  required: "Status display is required",
                },
              )}
              placeholder="Active"
            />
          </FormRow>
          <FormRow
            label="Status Text:"
            error={errors?.medicationRequests?.[index]?.status?.text?.message}
          >
            <FormInput
              {...register(`medicationRequests.${index}.status.text`, {
                required: "Status text is required",
              })}
              placeholder="Active"
            />
          </FormRow>

          {/* Intent */}
          <FormRow
            label="Intent Code:"
            error={
              errors?.medicationRequests?.[index]?.intent?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.intent.coding[0].code`,
                {
                  required: "Intent code is required",
                },
              )}
              placeholder="proposal"
            />
          </FormRow>
          <FormRow
            label="Intent Display:"
            error={
              errors?.medicationRequests?.[index]?.intent?.coding?.[0]?.display
                ?.message
            }
          >
            <FormInput
              {...register(
                `medicationRequests.${index}.intent.coding[0].display`,
                {
                  required: "Intent display is required",
                },
              )}
              placeholder="Proposal"
            />
          </FormRow>
          <FormRow
            label="Intent Text:"
            error={errors?.medicationRequests?.[index]?.intent?.text?.message}
          >
            <FormInput
              {...register(`medicationRequests.${index}.intent.text`, {
                required: "Intent text is required",
              })}
              placeholder="Proposal"
            />
          </FormRow>

          {/* Remove Button */}
          <Button
            type="button"
            onClick={() => remove(index)}
            aria-label={`Remove medication request ${index + 1}`}
          >
            -
          </Button>
        </div>
      ))}

      {/* Add Button */}
      <Button type="button" onClick={() => append({})}>
        Add Medication Request
      </Button>
    </div>
  );
};

export default MedicationRequestsForm;
