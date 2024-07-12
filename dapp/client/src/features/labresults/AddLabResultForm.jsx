/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateLabResult } from "./useLabResults";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormRow from "../../ui/FormRow";
import Spinner from "../../ui/Spinner";

const AddLabResultForm = ({ onSubmitSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const { createResult, isPending } = useCreateLabResult();

  const { fields: categoryFields, append: appendCategory } = useFieldArray({
    control,
    name: "category",
  });

  const { fields: interpretationFields, append: appendInterpretation } =
    useFieldArray({
      control,
      name: "interpretation",
    });

  const { fields: performerFields, append: appendPerformer } = useFieldArray({
    control,
    name: 'performer',
  });

  const { fields: noteFields, append: appendNote } = useFieldArray({
    control,
    name: "note",
  });

  const { fields: componentFields, append: appendComponent } = useFieldArray({
    control,
    name: "component",
  });

  const onSubmit = async (data) => {
    const labresult = {
      ...data,
      identifier: {
        system: "http://hospital.smarthealth.org"
      },
      effectivePeriod: {
        start: new Date(data.effectivePeriod.start).toISOString(),
        end: new Date(data.effectivePeriod.end).toISOString(),
      },
      issued: new Date(data.issued).toISOString()
    };

    createResult(labresult, {
      onSettled: () => {
        reset();
        onSubmitSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold">Add LabResult</h2>

      <FormRow label="Status:" error={errors.status?.message}>
        <FormInput {...register("status")} placeholder="registered" />
      </FormRow>

      <FormRow label="Category:" error={errors.category?.[0]?.text?.message}>
        {categoryFields.map((item, index) => (
          <FormInput
            key={item.id}
            {...register(`category[${index}].text`)}
            placeholder="laboratory"
          />
        ))}
        <Button type="button" onClick={() => appendCategory({})}>
          Add Category
        </Button>
      </FormRow>

      <FormRow label="Code:" error={errors.code?.text?.message}>
        <FormInput {...register("code.text")} placeholder="vital signs" />
      </FormRow>

      <FormRow
        label="Subject Reference:"
        error={errors.subject?.reference?.message}
      >
        <FormInput
          {...register("subject.reference", {
            required: "Subject reference is required",
          })}
          placeholder="Patient/12345"
        />
      </FormRow>

      <FormRow
        label="Encounter Reference:"
        error={errors.encounter?.reference?.message}
      >
        <FormInput
          {...register("encounter.reference", {
            required: "Encounter reference is required",
          })}
          placeholder="Encounter/67890"
        />
      </FormRow>

      <FormRow
        label="Effective Period Start:"
        error={errors.effectivePeriod?.start?.message}
      >
        <input type="datetime-local" {...register("effectivePeriod.start")} />
      </FormRow>

      <FormRow
        label="Effective Period End:"
        error={errors.effectivePeriod?.end?.message}
      >
        <input type="datetime-local" {...register("effectivePeriod.end")} />
      </FormRow>

      <FormRow label="Issued Date:" error={errors.issued?.message}>
        <input type="datetime-local" {...register("issued")} />
      </FormRow>

      <FormRow
        label="Interpretation:"
        error={errors.interpretation?.[0]?.text?.message}
      >
        {interpretationFields.map((item, index) => (
          <FormInput
            key={item.id}
            {...register(`interpretation[${index}].text`)}
            placeholder="description"
          />
        ))}
        <Button type="button" onClick={() => appendInterpretation({})}>
          Add Interpretation
        </Button>
      </FormRow>

      <FormRow label="Performers:" error={errors.performer?.[0]?.reference?.message}>
        {performerFields.map((item, index) => (
          <div key={item.id} className="flex space-x-2 mb-2">
            <FormInput
              {...register(`performer[${index}].reference`, {
                required: `Performer ${index + 1} reference is required`,
              })}
              placeholder="Practitioner/56789"
            />
            <FormInput
              {...register(`performer[${index}].display`)}
              placeholder="Dr. John Doe"
            />
            {index > 0 && (
              <Button
                type="button"
                variant="danger"
                onClick={() => removePerformer(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={() => appendPerformer({})}>
          Add Performer
        </Button>
      </FormRow>

      <FormRow label="Note Text:" error={errors.note?.[0]?.text?.message}>
        {noteFields.map((item, index) => (
          <FormInput
            key={item.id}
            {...register(`note[${index}].text`)}
            placeholder="Note"
          />
        ))}
        <Button type="button" onClick={() => appendNote({})}>
          Add Note
        </Button>
      </FormRow>

      <FormRow
        label="Component Code:"
        error={errors.component?.[0]?.code?.text?.message}
      >
        {componentFields.map((item, index) => (
          <FormInput
            key={item.id}
            {...register(`components[${index}].code.text`, {
              required: `Component ${index + 1} code is required`,
            })}
            placeholder="blood pressure"
          />
        ))}
        <Button type="button" onClick={() => appendComponent({})}>
          Add Component
        </Button>
      </FormRow>



      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? <Spinner size="small" /> : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default AddLabResultForm;
