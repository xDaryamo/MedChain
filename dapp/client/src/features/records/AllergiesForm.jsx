/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "../../ui/Button";

const AllergiesForm = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allergies",
  });

  const newInputRef = useRef(null);

  useEffect(() => {
    if (newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [fields]);

  const handleAddAllergy = () => {
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
          <h4 className="text-lg font-medium">Allergy {index + 1}</h4>
          <FormRow
            label="System"
            error={errors?.allergies?.[index]?.identifier?.system?.message}
          >
            <FormInput
              {...register(`allergies.${index}.identifier.system`, {
                required: "System is required",
              })}
              placeholder="http://hospital.smarthealth.org/allergies"
              ref={index === fields.length - 1 ? newInputRef : null}
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
          onClick={handleAddAllergy}
          variant="secondary"
          size="small"
        >
          <FaPlus className="mr-1" /> Aggiungi Allergia
        </Button>
      </div>
    </div>
  );
};

export default AllergiesForm;
