/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";

const AllergiesForm = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allergies",
  });

  return (
    <div>
      <h3 className="text-xl font-semibold">Allergies</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <FormRow label="System">
            <FormInput
              {...register(`allergies.${index}.identifier.system`, {
                required: "System is required",
              })}
              placeholder="http://hospital.smarthealth.org/allergies"
            />
          </FormRow>
          <FormRow label="Value">
            <FormInput
              {...register(`allergies.${index}.identifier.value`, {
                required: "Value is required",
              })}
              placeholder="12345"
            />
          </FormRow>
          <FormRow label="Clinical Status Code">
            <FormInput
              {...register(`allergies.${index}.clinicalStatus.coding[0].code`, {
                required: "Code is required",
              })}
              placeholder="active"
            />
          </FormRow>
          <FormRow label="Clinical Status Display">
            <FormInput
              {...register(
                `allergies.${index}.clinicalStatus.coding[0].display`,
                { required: "Display is required" },
              )}
              placeholder="Active"
            />
          </FormRow>
          <FormRow label="Verification Status Code">
            <FormInput
              {...register(
                `allergies.${index}.verificationStatus.coding[0].code`,
                { required: "Code is required" },
              )}
              placeholder="confirmed"
            />
          </FormRow>
          <FormRow label="Verification Status Display">
            <FormInput
              {...register(
                `allergies.${index}.verificationStatus.coding[0].display`,
                { required: "Display is required" },
              )}
              placeholder="Confirmed"
            />
          </FormRow>
          <FormRow label="Type">
            <FormInput
              {...register(`allergies.${index}.type`, {
                required: "Type is required",
              })}
              placeholder="allergy"
            />
          </FormRow>
          <FormRow label="Category">
            <FormInput
              {...register(`allergies.${index}.category[0]`, {
                required: "Category is required",
              })}
              placeholder="medication"
            />
          </FormRow>
          <FormRow label="Criticality">
            <FormInput
              {...register(`allergies.${index}.criticality`, {
                required: "Criticality is required",
              })}
              placeholder="high"
            />
          </FormRow>
          <FormRow label="Patient Reference">
            <FormInput
              {...register(`allergies.${index}.patient.reference`, {
                required: "Patient reference is required",
              })}
              placeholder="Patient/67890"
            />
          </FormRow>
          <FormRow label="Patient Display">
            <FormInput
              {...register(`allergies.${index}.patient.display`, {
                required: "Patient display is required",
              })}
              placeholder="John Doe"
            />
          </FormRow>
          <FormRow label="Code System">
            <FormInput
              {...register(`allergies.${index}.code.coding[0].system`, {
                required: "Code system is required",
              })}
              placeholder="http://www.nlm.nih.gov/research/umls/rxnorm"
            />
          </FormRow>
          <FormRow label="Code">
            <FormInput
              {...register(`allergies.${index}.code.coding[0].code`, {
                required: "Code is required",
              })}
              placeholder="2670"
            />
          </FormRow>
          <FormRow label="Code Display">
            <FormInput
              {...register(`allergies.${index}.code.coding[0].display`, {
                required: "Display is required",
              })}
              placeholder="Penicillin"
            />
          </FormRow>
          <FormRow label="Reaction Manifestation">
            <FormInput
              {...register(
                `allergies.${index}.reaction[0].manifestation[0].coding[0].display`,
                { required: "Reaction manifestation is required" },
              )}
              placeholder="Anaphylactic reaction"
            />
          </FormRow>
          <FormRow label="Reaction Severity">
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
