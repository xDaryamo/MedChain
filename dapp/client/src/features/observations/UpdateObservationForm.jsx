/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useUpdateObservation } from "./useObservations"; // Assuming you have a custom hook for updating observations
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import { useEffect } from "react";

const UpdateObservationForm = ({ observation, onUpdate, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            identifier: observation.identifier || [],
            status: observation.status || {},
            category: observation.category || [],
            code: observation.code || {},
            subject: observation.subject || {},
            encounter: observation.encounter || {},
            effectivePeriod: observation.effectivePeriod || {},
            issued: observation.issued || null,
            performer: observation.performer || [],
            interpretation: observation.interpretation || [],
            note: observation.note || [],
            component: observation.component || [],
        },
    });

    const { updateObservation, isUpdating } = useUpdateObservation();

    useEffect(() => {
        reset({
            identifier: observation.identifier || [],
            status: observation.status || {},
            category: observation.category || [],
            code: observation.code || {},
            subject: observation.subject || {},
            encounter: observation.encounter || {},
            effectivePeriod: observation.effectivePeriod || {},
            issued: observation.issued || null,
            performer: observation.performer || [],
            interpretation: observation.interpretation || [],
            note: observation.note || [],
            component: observation.component || [],
        });
    }, [observation, reset]);

    const onSubmit = async (data) => {
        const updatedObservation = {
            identifier: data.identifier || [],
            status: data.status || {},
            category: data.category || [],
            code: data.code || {},
            subject: data.subject || {},
            encounter: data.encounter || {},
            effectivePeriod: data.effectivePeriod || {},
            issued: data.issued || null,
            performer: data.performer || [],
            interpretation: data.interpretation || [],
            note: data.note || [],
            component: data.component || [],
        };

        try {
            await updateObservation(observation.id, updatedObservation);
            reset();
            onUpdate();
        } catch (err) {
            console.error("Error updating observation:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">Update Observation</h2>

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

            <FormRow
                label="Code"
                error={errors.code?.message}
            >
                <FormInput
                    type="text"
                    {...register("code", {
                        required: "Code is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Subject Reference"
                error={errors.subject?.reference?.message}
            >
                <FormInput
                    type="text"
                    {...register("subject.reference", {
                        required: "Subject reference is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Encounter Reference"
                error={errors.encounter?.reference?.message}
            >
                <FormInput
                    type="text"
                    {...register("encounter.reference")}
                />
            </FormRow>

            <FormRow
                label="Effective Period Start"
                error={errors.effectivePeriod?.start?.message}
            >
                <FormInput
                    type="datetime-local"
                    {...register("effectivePeriod.start")}
                />
            </FormRow>

            <FormRow
                label="Effective Period End"
                error={errors.effectivePeriod?.end?.message}
            >
                <FormInput
                    type="datetime-local"
                    {...register("effectivePeriod.end")}
                />
            </FormRow>

            <FormRow
                label="Issued"
                error={errors.issued?.message}
            >
                <FormInput
                    type="datetime-local"
                    {...register("issued")}
                />
            </FormRow>

            {observation.performer.map((performer, index) => (
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

            {observation.note.map((note, index) => (
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

            {observation.component.map((component, index) => (
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

export default UpdateObservationForm;
