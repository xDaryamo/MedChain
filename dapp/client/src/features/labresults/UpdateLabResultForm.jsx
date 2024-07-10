/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useUpdateLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";

const UpdateLabResultForm = ({ labresult, onUpdate, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: labresult,
    });

    const { updateLabresult, isUpdating } = useUpdateLabResult();

    const onSubmit = async (data) => {
        const updatedLabResult = {
            ...labresult,
            status: data.status || {},
            category: data.category || [],
            performer: data.performer || [],
            note: data.note || [],
            component: data.component || [],
        };

        try {
            await updateLabresult(labresult.identifier.value, updatedLabResult);
            reset();
            onUpdate();
        } catch (err) {
            console.error("Error updating labresult:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">Update Lab Result</h2>

            <FormRow
                label="Status"
                error={errors.status?.message}
            >
                <FormInput
                    type="text"
                    {...register("status", {
                        required: "Status is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Category"
                error={errors.category?.message}
            >
                <FormInput
                    type="text"
                    {...register("category", {
                        required: "Category is required",
                    })}
                />
            </FormRow>

            {labresult.performer.map((index) => (
                <FormRow
                    key={index}
                    label={`Performer ${index + 1}`}
                    error={errors.performer?.[index]?.message}
                >
                    <FormInput
                        type="text"
                        {...register(`performer.${index}`)}
                    />
                </FormRow>
            ))}
            <Button type="button" onClick={() => appendPerformer({})}>Add Performer</Button>

            {labresult.note.map((index) => (
                <FormRow
                    key={index}
                    label={`Note ${index + 1}`}
                    error={errors.note?.[index]?.message}
                >
                    <FormInput
                        type="text"
                        {...register(`note.${index}.text`)}
                    />
                </FormRow>
            ))}
            <Button type="button" onClick={() => appendNote({})}>Add Note</Button>

            {labresult.component.map((index) => (
                <FormRow
                    key={index}
                    label={`Component ${index + 1}`}
                    error={errors.component?.[index]?.message}
                >
                    <FormInput
                        type="text"
                        {...register(`component.${index}.code`)}
                    />
                </FormRow>
            ))}
            <Button type="button" onClick={() => appendComponent({})}>Add Component</Button>

            <div className="flex space-x-4">
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <Spinner /> : "Update Observation"}
                </Button>
                <Button type="button" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default UpdateLabResultForm;