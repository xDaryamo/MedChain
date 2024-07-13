import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useUpdateEncounter, useGetEncounter } from "./useEncounters";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormRow from "../../ui/FormRow";
import FormSelect from "../../ui/FormSelect";
import Spinner from "../../ui/Spinner";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../ui/BackButton";
import Heading from "../../ui/Heading";

const statusOptions = [
    { value: "planned", label: "Pianificato" },
    { value: "arrived", label: "Arrivato" },
    { value: "in-progress", label: "In corso" },
    { value: "onleave", label: "In pausa" },
    { value: "finished", label: "Concluso" },
    { value: "cancelled", label: "Annullato" },
];

const defaultLocation = {
    status: { coding: [{ system: '', code: '', display: '' }] },
    name: 'Example Location',
    alias: 'Alias Name',
    description: 'Description of the location',
    type: { coding: [{ system: '', code: '', display: '' }] },
    mode: { code: '' },
    contact: {
        telecom: {
            system: { coding: [{ system: '', code: '', display: '' }] }
            , value: ''
        },
        address: { city: '', district: '', postalCode: '' },
    },
    managingOrganization: { reference: '', display: '' },
    hoursOfOperation: {
        daysOfWeek: ['monday', 'tuesday'],
        allDay: false,
        startTime: '08:00',
        endTime: '17:00',
    },
};

const UpdateEncounterForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isPending: encounterLoading, encounter } = useGetEncounter(id);
    const { updateEncounter, isPending: updatePending } = useUpdateEncounter();

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            type: [],
            participant: [],
            reasonReference: [],
            diagnosis: [],
        },
    });

    const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({
        control,
        name: "type",
    });

    const { fields: participantFields, append: appendParticipant, remove: removeParticipant } = useFieldArray({
        control,
        name: "participant",
    });

    const { fields: reasonReferenceFields, append: appendReasonReference, remove: removeReasonReference } = useFieldArray({
        control,
        name: "reasonReference",
    });

    const { fields: diagnosisFields, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
        control,
        name: "diagnosis",
    });

    useEffect(() => {
        if (encounter) {
            const formattedData = {
                ...encounter,
                status: encounter.encounter.status?.coding[0]?.code,
                class: encounter.encounter.class?.coding?.code,
                period: encounter.encounter.period,
                type: encounter.encounter.type?.coding?.[0].code,
                serviceType: encounter.encounter.serviceType?.coding?.[0].code,
                priority: {
                    coding: [{ code: encounter.encounter.priority?.coding[0]?.code || "", display: encounter.priority?.coding[0]?.display || "" }]
                },
                type: encounter.encounter.type?.map((t) => ({ coding: [{ code: t.coding[0].code }] })) || [],
                participant: encounter.encounter.participant?.map((p) => ({ individual: { reference: p.individual.reference } })) || [],
                reasonReference: encounter.encounter.reasonReference?.map((r) => ({ reference: r.reference })) || [],
                diagnosis: encounter.encounter.diagnosis?.map((d) => ({ condition: { reference: d.condition.reference } })) || [],
                location: encounter.encounter.location || defaultLocation,
            };

            reset(formattedData);
        }
    }, [encounter, reset]);

    const onSubmit = async (data) => {
        const encounterData = {
            identifier: {
                system: encounter.encounter.identifier.system,
                value: id
            },
            subject: encounter.encounter.subject,
            period: encounter.encounter.period,
            class: encounter.encounter.class,
            serviceType: encounter.encounter.serviceType,
            status: {
                coding: [
                    {
                        system: "http://hl7.org/fhir/R4/valueset-encounter-status.html",
                        code: data.status,
                        display: statusOptions.find(option => option.value === data.status)?.label,
                    },
                ],
            },
            priority: {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
                        code: data.priority?.coding?.[0]?.code || "",
                        display: data.priority?.coding?.[0]?.display || "",
                    },
                ],
            },
            type: data.type.map((type) => ({
                coding: [
                    {
                        system: "http://snomed.info/sct",
                        code: type.coding[0].code,
                        display: type.coding[0].code,
                    },
                ],
            })),
            participant: data.participant.map((part) => ({
                individual: {
                    reference: part.individual?.reference || "",
                },
            })),
            reasonReference: data.reasonReference.map((reason) => ({
                reference: reason.reference || "",
            })),
            diagnosis: data.diagnosis.map((diag) => ({
                condition: {
                    reference: diag.condition?.reference || "",
                },
            })),
            location: [defaultLocation],
        };

        try {
            await updateEncounter(
                { id, encounter: encounterData },
                {
                    onSettled: () => {
                        reset();
                        navigate(-1);
                    },
                }
            );
        } catch (err) {
            console.error("Error updating encounter:", err.message);
        }
    };

    if (encounterLoading) return <Spinner />;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div>
                <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Heading>Modifica Incontro</Heading>

                <FormRow label="Stato:" error={errors.status?.message}>
                    <FormSelect
                        id="status"
                        {...register("status", { required: "Lo stato è obbligatorio" })}
                        options={statusOptions}
                    />
                </FormRow>

                <FormRow label="Priorità:" error={errors.priority?.coding?.[0]?.code?.message}>
                    <FormInput
                        id="priority"
                        {...register("priority.coding[0].code", { required: "La priorità è obbligatoria" })}
                        placeholder="urgente"
                    />
                </FormRow>

                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Tipo</h3>
                    {typeFields.map((type, index) => (
                        <div key={type.id} className="mb-2 flex space-x-2">
                            <FormInput
                                {...register(`type[${index}].coding[0].code`, { required: `Il codice del tipo ${index + 1} è obbligatorio` })}
                                placeholder="consultazione"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeType(index)}
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
                            onClick={() => appendType({ coding: [{ code: "" }] })}
                            variant="secondary"
                            size="small"
                        >
                            <FaPlus className="mr-1" /> Aggiungi Tipo
                        </Button>
                    </div>
                </div>

                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Partecipante</h3>
                    {participantFields.map((participant, index) => (
                        <div key={participant.id} className="mb-2 flex space-x-2">
                            <FormInput
                                {...register(`participant[${index}].individual.reference`, { required: `Il riferimento del partecipante ${index + 1} è obbligatorio` })}
                                placeholder="123"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeParticipant(index)}
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
                            onClick={() => appendParticipant({ individual: { reference: "" } })}
                            variant="secondary"
                            size="small"
                        >
                            <FaPlus className="mr-1" /> Aggiungi Partecipante
                        </Button>
                    </div>
                </div>

                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Riferimento del motivo</h3>
                    {reasonReferenceFields.map((reasonRef, index) => (
                        <div key={reasonRef.id} className="mb-2 flex space-x-2">
                            <FormInput
                                {...register(`reasonReference[${index}].reference`, { required: `Il riferimento del motivo ${index + 1} è obbligatorio` })}
                                placeholder="123"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeReasonReference(index)}
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
                            onClick={() => appendReasonReference({ reference: "" })}
                            variant="secondary"
                            size="small"
                        >
                            <FaPlus className="mr-1" /> Aggiungi Riferimento del motivo
                        </Button>
                    </div>
                </div>

                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Diagnosi</h3>
                    {diagnosisFields.map((diagnosis, index) => (
                        <div key={diagnosis.id} className="mb-2 flex space-x-2">
                            <FormInput
                                {...register(`diagnosis[${index}].condition.reference`, { required: `Il riferimento della diagnosi ${index + 1} è obbligatorio` })}
                                placeholder="123"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeDiagnosis(index)}
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
                            onClick={() => appendDiagnosis({ condition: { reference: "" } })}
                            variant="secondary"
                            size="small"
                        >
                            <FaPlus className="mr-1" /> Aggiungi Diagnosi
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button type="submit" disabled={updatePending} className="w-32">
                        {updatePending ? <Spinner size="sm" /> : "Aggiorna"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateEncounterForm;
