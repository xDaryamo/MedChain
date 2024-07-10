/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useUpdateEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";

const UpdateEncounterForm = ({ encounter, onUpdate, onCancel }) => {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: encounter,
    });

    const { updateEncounter, isPending } = useUpdateEncounter();

    const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({
        control,
        name: "type"
    });

    const { fields: participantFields, append: appendParticipant, remove: removeParticipant } = useFieldArray({
        control,
        name: "participant"
    });

    const { fields: reasonReferenceFields, append: appendReasonReference, remove: removeReasonReference } = useFieldArray({
        control,
        name: "reasonReference"
    });

    const { fields: diagnosisFields, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
        control,
        name: "diagnosis"
    });

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control,
        name: "location"
    });

    const onSubmit = async (data) => {

        const updatedEncounter = {
            ...encounter,
            status: data.status,
            priority: data.priority,
            type: data.type || [],
            participant: data.participant || [],
            reasonReference: data.reasonReference || [],
            diagnosis: data.diagnosis || [],
            location: data.location || [],
        }

        try {
            await updateEncounter(encounter.identifier.value, updatedEncounter);
            reset();
            onUpdate();
        } catch (err) {
            console.error("Error updating encounter:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">Update Encounter</h2>

            {typeFields.map((type, index) => (
                <div key={type.id}>
                    <FormRow
                        label={`Type ${index + 1}:`}
                        error={errors.type?.[index]?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register(`type.${index}.coding[0].code`, {
                                required: `Type ${index + 1} code is required`
                            })}
                            placeholder="consultation"
                        />
                    </FormRow>
                    <Button type="button" onClick={() => removeType(index)}>Remove Type</Button>
                </div>
            ))}
            <Button type="button" onClick={() => appendType({})}>Add Type</Button>

            {participantFields.map((participant, index) => (
                <div key={participant.id}>
                    <FormRow
                        label={`Participant ${index + 1} Type:`}
                        error={errors.participant?.[index]?.type?.[0]?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register(`participant.${index}.type[0].coding[0].code`, {
                                required: `Participant ${index + 1} type code is required`
                            })}
                            placeholder="Practitioner/123"
                        />
                    </FormRow>
                    <Button type="button" onClick={() => removeParticipant(index)}>Remove Participant</Button>
                </div>
            ))}
            <Button type="button" onClick={() => appendParticipant({})}>Add Participant</Button>

            {reasonReferenceFields.map((reasonRef, index) => (
                <div key={reasonRef.id}>
                    <FormRow
                        label={`Reason Reference ${index + 1}:`}
                        error={errors.reasonReference?.[index]?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register(`reasonReference.${index}.coding[0].code`, {
                                required: `Reason Reference ${index + 1} code is required`
                            })}
                            placeholder="Condition/123"
                        />
                    </FormRow>
                    <Button type="button" onClick={() => removeReasonReference(index)}>Remove Reason Reference</Button>
                </div>
            ))}
            <Button type="button" onClick={() => appendReasonReference({})}>Add Reason Reference</Button>

            {diagnosisFields.map((diagnosis, index) => (
                <div key={diagnosis.id}>
                    <FormRow
                        label={`Diagnosis ${index + 1} Condition Reference:`}
                        error={errors.diagnosis?.[index]?.condition?.reference?.message}
                    >
                        <FormInput
                            {...register(`diagnosis.${index}.condition.reference`, {
                                required: `Diagnosis ${index + 1} condition reference is required`
                            })}
                            placeholder="Condition/123"
                        />
                    </FormRow>
                    <Button type="button" onClick={() => removeDiagnosis(index)}>Remove Diagnosis</Button>
                </div>
            ))}
            <Button type="button" onClick={() => appendDiagnosis({})}>Add Diagnosis</Button>

            {locationFields.map((location, index) => (
                <div key={location.id}>
                    <h3>Location {index + 1}</h3>
                    <FormRow
                        label="Location Status:"
                        error={errors.location?.[index]?.status?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.status`, {
                                required: `Location ${index + 1} status is required`
                            })}
                            placeholder="active"
                        />
                    </FormRow>
                    <FormRow
                        label="Location Name:"
                        error={errors.location?.[index]?.name?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.name`, {
                                required: `Location ${index + 1} name is required`
                            })}
                            placeholder="Main Hospital"
                        />
                    </FormRow>
                    <FormRow
                        label="Location Type:"
                        error={errors.location?.[index]?.type?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.type.coding[0].code`)}
                            placeholder="hospital"
                        />
                    </FormRow>
                    <FormRow
                        label="Location Contact:"
                        error={errors.location?.[index]?.contact?.value?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.contact.value`)}
                            placeholder="123-456-7890"
                        />
                    </FormRow>
                    <FormRow
                        label="Location Address:"
                        error={errors.location?.[index]?.address?.line?.[0]?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.address.line[0]`, {
                                required: `Location ${index + 1} address is required`
                            })}
                            placeholder="123 Main St"
                        />
                    </FormRow>
                    <Button type="button" onClick={() => removeLocation(index)}>Remove Location</Button>
                </div>
            ))}
            <Button type="button" onClick={() => appendLocation({})}>Add Location</Button>

            <FormRow
                label="Status:"
                error={errors.status?.message}
            >
                <FormInput
                    {...register("status", {
                        required: "Status is required"
                    })}
                    placeholder="planned"
                />
            </FormRow>

            <FormRow
                label="Priority:"
                error={errors.priority?.coding?.[0]?.code?.message}
            >
                <FormInput
                    {...register("priority.coding[0].code")}
                    placeholder="urgent"
                />
            </FormRow>

            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="secondary">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending ? <Spinner size="small" /> : "Update"}
                </Button>
            </div>
        </form>
    );
};

export default UpdateEncounterForm;
