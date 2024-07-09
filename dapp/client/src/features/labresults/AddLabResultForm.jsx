/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateLabResult } from "./useLabResults";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";

const AddLabResultForm = ({ onSubmitSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { addLabResult, isPending } = useCreateLabResult();

  const { fields: categoryFields, append: appendCategory } = useFieldArray({
    control,
    name: "category",
  });

  const { fields: interpretationFields, append: appendInterpretation } =
    useFieldArray({
      control,
      name: "interpretation",
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
      status: data.status,
      category: data.category.map((cat) => ({ text: cat.text })),
      code: { text: data.code.text },
      subject: { reference: data.subject.reference },
      encounter: { reference: data.encounter.reference },
      effectivePeriod: {
        start: data.effectivePeriod.start,
        end: data.effectivePeriod.end,
      },
      issued: data.issued,
      interpretation: data.interpretation.map((inter) => ({
        text: inter.text,
      })),
      note: data.note.map((note) => ({ text: note.text })),
      component: data.component.map((comp) => ({
        code: { text: comp.code.text },
      })),
    };

    await addLabResult(labresult, {
      onSettled: () => {
        // eslint-disable-next-line no-undef
        reset();
        onSubmitSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold">Add Observation</h2>

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
            placeholder="normal"
          />
        ))}
        <Button type="button" onClick={() => appendInterpretation({})}>
          Add Interpretation
        </Button>
      </FormRow>

      <FormRow label="Note Text:" error={errors.note?.[0]?.text?.message}>
        {noteFields.map((item, index) => (
          <FormInput
            key={item.id}
            {...register(`note[${index}].text`)}
            placeholder="Observation note"
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
            {...register(`component[${index}].code.text`, {
              required: `Component ${index + 1} code is required`,
            })}
            placeholder="blood pressure"
          />
        ))}
        <Button type="button" onClick={() => appendComponent({})}>
          Add Component
        </Button>
      </FormRow>

      {error && <p>{error}</p>}

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
