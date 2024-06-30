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
        await updateEncounter(data);
        onUpdate();
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
                            placeholder="Practitioner"
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
                    <FormRow
                        label={`Location ${index + 1} Name:`}
                        error={errors.location?.[index]?.name?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.name`, {
                                required: `Location ${index + 1} name is required`
                            })}
                            placeholder="Main Hospital"
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
                label="Class:"
                error={errors.class?.code?.message}
            >
                <FormInput
                    {...register("class.code")}
                    placeholder="inpatient"
                />
            </FormRow>

            <FormRow
                label="Service Type:"
                error={errors.serviceType?.coding?.[0]?.code?.message}
            >
                <FormInput
                    {...register("serviceType.coding[0].code")}
                    placeholder="primary care"
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

            <FormRow
                label="Subject Reference:"
                error={errors.subject?.reference?.message}
            >
                <FormInput
                    {...register("subject.reference", {
                        required: "Subject reference is required"
                    })}
                    placeholder="Patient/67890"
                />
            </FormRow>

            <FormRow
                label="Based On Reference:"
                error={errors.basedOn?.[0]?.reference?.message}
            >
                <FormInput
                    {...register("basedOn[0].reference")}
                    placeholder="ServiceRequest/123"
                />
            </FormRow>

            <FormRow
                label="Appointment Reference:"
                error={errors.appointment?.reference?.message}
            >
                <FormInput
                    {...register("appointment.reference")}
                    placeholder="Appointment/123"
                />
            </FormRow>

            <FormRow
                label="Period Start:"
                error={errors.period?.start?.message}
            >
                <input
                    type="datetime-local"
                    {...register("period.start", {
                        required: "Period start is required"
                    })}
                />
            </FormRow>

            <FormRow
                label="Period End:"
                error={errors.period?.end?.message}
            >
                <input
                    type="datetime-local"
                    {...register("period.end", {
                        required: "Period end is required"
                    })}
                />
            </FormRow>

            <FormRow
                label="Length (in seconds):"
                error={errors.length?.message}
            >
                <FormInput
                    {...register("length")}
                    placeholder="3600"
                />
            </FormRow>

            <FormRow
                label="Reason Code:"
                error={errors.reasonCode?.coding?.[0]?.code?.message}
            >
                <FormInput
                    {...register("reasonCode.coding[0].code")}
                    placeholder="checkup"
                />
            </FormRow>

            <FormRow
                label="Service Provider Reference:"
                error={errors.serviceProvider?.reference?.message}
            >
                <FormInput
                    {...register("serviceProvider.reference")}
                    placeholder="Organization/123"
                />
            </FormRow>

            <FormRow
                label="Part Of Reference:"
                error={errors.partOf?.reference?.message}
            >
                <FormInput
                    {...register("partOf.reference")}
                    placeholder="Encounter/123"
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
