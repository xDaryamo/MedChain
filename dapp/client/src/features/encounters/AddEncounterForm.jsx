import { useForm, useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useAddEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";

const AddEncounterForm = ({ onAdd, onCancel }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

    const { addEncounter, isPending } = useAddEncounter();

    const { id: practitionerID } = useParams();

    const { fields: typeFields, append: appendType } = useFieldArray({
        control,
        name: "type"
    });

    const { fields: reasonReferenceFields, append: appendReasonReference } = useFieldArray({
        control,
        name: "reasonReference"
    });

    const { fields: diagnosisFields, append: appendDiagnosis } = useFieldArray({
        control,
        name: "diagnosis"
    });

    const { fields: locationFields, append: appendLocation } = useFieldArray({
        control,
        name: "location"
    });

    const onSubmit = async (data) => {
        const encounterData = {
            ...data,
            identifier: {
                system: "urn:ietf:rfc:3986"
            },
            participant: [
                {
                    individual: { reference: `Practitioner/${practitionerID}` }
                }
            ],
        };

        await addEncounter(encounterData, {
            onSettled: () => {
                reset();
                onAdd();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold">Add Encounter</h2>

            <FormRow
                label="Status:"
                error={errors.status?.message}
            >
                <FormInput
                    {...register("status", { required: "Status is required" })}
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

            {typeFields.map((item, index) => (
                <FormRow
                    key={item.id}
                    label={`Type ${index + 1}:`}
                    error={errors.type?.[index]?.coding?.[0]?.code?.message}
                >
                    <FormInput
                        {...register(`type.${index}.coding[0].code`)}
                        placeholder="consultation"
                    />
                </FormRow>
            ))}
            <Button type="button" onClick={() => appendType({})}>Add Type</Button>

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
                    {...register("subject.reference", { required: "Subject reference is required" })}
                    placeholder="Patient/67890"
                />
            </FormRow>

            <FormRow
                label="Period Start:"
                error={errors.period?.start?.message}
            >
                <input
                    type="datetime-local"
                    {...register("period.start", { required: "Period start is required" })}
                />
            </FormRow>

            <FormRow
                label="Period End:"
                error={errors.period?.end?.message}
            >
                <input
                    type="datetime-local"
                    {...register("period.end", { required: "Period end is required" })}
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

            {reasonReferenceFields.map((item, index) => (
                <FormRow
                    key={item.id}
                    label={`Reason Reference ${index + 1}:`}
                    error={errors.reasonReference?.[index]?.coding?.[0]?.code?.message}
                >
                    <FormInput
                        {...register(`reasonReference.${index}.coding[0].code`)}
                        placeholder="Condition/123"
                    />
                </FormRow>
            ))}
            <Button type="button" onClick={() => appendReasonReference({})}>Add Reason Reference</Button>

            {diagnosisFields.map((item, index) => (
                <div key={item.id}>
                    <h3>Diagnosis {index + 1}</h3>
                    <FormRow
                        label="Condition Reference:"
                        error={errors.diagnosis?.[index]?.condition?.reference?.message}
                    >
                        <FormInput
                            {...register(`diagnosis.${index}.condition.reference`)}
                            placeholder="Condition/123"
                        />
                    </FormRow>
                    <FormRow
                        label="Use:"
                        error={errors.diagnosis?.[index]?.use?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register(`diagnosis.${index}.use.coding[0].code`)}
                            placeholder="admission"
                        />
                    </FormRow>
                    <FormRow
                        label="Rank:"
                        error={errors.diagnosis?.[index]?.rank?.message}
                    >
                        <FormInput
                            {...register(`diagnosis.${index}.rank`)}
                            placeholder="1"
                        />
                    </FormRow>
                </div>
            ))}
            <Button type="button" onClick={() => appendDiagnosis({})}>Add Diagnosis</Button>

            {locationFields.map((item, index) => (
                <div key={item.id}>
                    <h3>Location {index + 1}</h3>
                    <FormRow
                        label="Location Status:"
                        error={errors.location?.[index]?.status?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.status`)}
                            placeholder="active"
                        />
                    </FormRow>
                    <FormRow
                        label="Location Name:"
                        error={errors.location?.[index]?.name?.message}
                    >
                        <FormInput
                            {...register(`location.${index}.name`, { required: "Location name is required" })}
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
                            {...register(`location.${index}.address.line[0]`, { required: "Location address is required" })}
                            placeholder="123 Main St"
                        />
                    </FormRow>
                </div>
            ))}
            <Button type="button" onClick={() => appendLocation({})}>Add Location</Button>

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
                    {isPending ? <Spinner size="small" /> : "Add"}
                </Button>
            </div>
        </form>
    );
};

export default AddEncounterForm;
