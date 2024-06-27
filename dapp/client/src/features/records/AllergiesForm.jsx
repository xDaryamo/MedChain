/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

const AllergiesForm = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allergies",
  });

  return (
    <div>
      <h3 className="text-xl font-semibold">Allergies</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <FormRow
            label="System"
            error={errors?.allergies?.[index]?.identifier?.system?.message}
          >
            <FormInput
              {...register(`allergies.${index}.identifier.system`, {
                required: "System is required",
              })}
              placeholder="http://hospital.smarthealth.org/allergies"
            />
          </FormRow>
          <FormRow
            label="Value"
            error={errors?.allergies?.[index]?.identifier?.value?.message}
          >
            <FormInput
              {...register(`allergies.${index}.identifier.value`, {
                required: "Value is required",
              })}
              placeholder="12345"
            />
          </FormRow>
          <FormRow
            label="Clinical Status Code"
            error={
              errors?.allergies?.[index]?.clinicalStatus?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(`allergies.${index}.clinicalStatus.coding[0].code`, {
                required: "Code is required",
              })}
              placeholder="active"
            />
          </FormRow>
          <FormRow
            label="Clinical Status Display"
            error={
              errors?.allergies?.[index]?.clinicalStatus?.coding?.[0]?.display
                ?.message
            }
          >
            <FormInput
              {...register(
                `allergies.${index}.clinicalStatus.coding[0].display`,
                { required: "Display is required" },
              )}
              placeholder="Active"
            />
          </FormRow>
          <FormRow
            label="Verification Status Code"
            error={
              errors?.allergies?.[index]?.verificationStatus?.coding?.[0]?.code
                ?.message
            }
          >
            <FormInput
              {...register(
                `allergies.${index}.verificationStatus.coding[0].code`,
                { required: "Code is required" },
              )}
              placeholder="confirmed"
            />
          </FormRow>
          <FormRow
            label="Verification Status Display"
            error={
              errors?.allergies?.[index]?.verificationStatus?.coding?.[0]
                ?.display?.message
            }
          >
            <FormInput
              {...register(
                `allergies.${index}.verificationStatus.coding[0].display`,
                { required: "Display is required" },
              )}
              placeholder="Confirmed"
            />
          </FormRow>
          <FormRow
            label="Type"
            error={errors?.allergies?.[index]?.type?.message}
          >
            <FormInput
              {...register(`allergies.${index}.type`, {
                required: "Type is required",
              })}
              placeholder="allergy"
            />
          </FormRow>
          <FormRow
            label="Category"
            error={errors?.allergies?.[index]?.category?.[0]?.message}
          >
            <FormInput
              {...register(`allergies.${index}.category[0]`, {
                required: "Category is required",
              })}
              placeholder="medication"
            />
          </FormRow>
          <FormRow
            label="Criticality"
            error={errors?.allergies?.[index]?.criticality?.message}
          >
            <FormInput
              {...register(`allergies.${index}.criticality`, {
                required: "Criticality is required",
              })}
              placeholder="high"
            />
          </FormRow>
          <FormRow
            label="Patient Reference"
            error={errors?.allergies?.[index]?.patient?.reference?.message}
          >
            <FormInput
              {...register(`allergies.${index}.patient.reference`, {
                required: "Patient reference is required",
              })}
              placeholder="Patient/67890"
            />
          </FormRow>
          <FormRow
            label="Patient Display"
            error={errors?.allergies?.[index]?.patient?.display?.message}
          >
            <FormInput
              {...register(`allergies.${index}.patient.display`, {
                required: "Patient display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>
          <FormRow
            label="Code System"
            error={
              errors?.allergies?.[index]?.code?.coding?.[0]?.system?.message
            }
          >
            <FormInput
              {...register(`allergies.${index}.code.coding[0].system`, {
                required: "Code system is required",
              })}
              placeholder="http://www.nlm.nih.gov/research/umls/rxnorm"
            />
          </FormRow>
          <FormRow
            label="Code"
            error={errors?.allergies?.[index]?.code?.coding?.[0]?.code?.message}
          >
            <FormInput
              {...register(`allergies.${index}.code.coding[0].code`, {
                required: "Code is required",
              })}
              placeholder="2670"
            />
          </FormRow>
          <FormRow
            label="Code Display"
            error={
              errors?.allergies?.[index]?.code?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(`allergies.${index}.code.coding[0].display`, {
                required: "Display is required",
              })}
              placeholder="Penicillin"
            />
          </FormRow>
          <FormRow
            label="Reaction Manifestation"
            error={
              errors?.allergies?.[index]?.reaction?.[0]?.manifestation?.[0]
                ?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(
                `allergies.${index}.reaction[0].manifestation[0].coding[0].display`,
                { required: "Reaction manifestation is required" },
              )}
              placeholder="Anaphylactic reaction"
            />
          </FormRow>
          <FormRow
            label="Reaction Severity"
            error={errors?.allergies?.[index]?.reaction?.[0]?.severity?.message}
          >
            <FormInput
              {...register(`allergies.${index}.reaction[0].severity`, {
                required: "Reaction severity is required",
              })}
              placeholder="severe"
            />
          </FormRow>
          <Button type="button" onClick={() => remove(index)}>
            -
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({})}>
        Add Allergy
      </Button>
    </div>
  );
};

export default AllergiesForm;
