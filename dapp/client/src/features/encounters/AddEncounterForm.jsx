/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useAddEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";

const statusOptions = [
    { value: "planned", label: "Pianificato" },
    { value: "arrived", label: "Arrivato" },
    { value: "in-progress", label: "In corso" },
    { value: "onleave", label: "In pausa" },
    { value: "finished", label: "Concluso" },
    { value: "cancelled", label: "Annullato" },
];

const classOptions = [
    { value: "inpatient", label: "In paziente" },
    { value: "outpatient", label: "Ambulatoriale" },
    { value: "emergency", label: "Emergenza" },
];

const AddEncounterForm = ({ onSubmitSuccess, onCancel }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const { addEncounter, isPending } = useAddEncounter();
    const { id: practitionerID } = useParams();

    const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({
        control,
        name: "type"
    });

    const { fields: reasonReferenceFields, append: appendReasonReference, remove: removeReasonReference } = useFieldArray({
        control,
        name: "reasonReference"
    });

    const { fields: diagnosisFields, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
        control,
        name: "diagnosis"
    });

    const [focusIndex, setFocusIndex] = useState(null);

    useEffect(() => {
        if (focusIndex !== null) {
            const element = document.getElementById(`type.${focusIndex}.coding[0].code`);
            if (element) {
                element.focus();
            }
        }
    }, [focusIndex]);

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            period: {
                start: new Date(data.period.start).toISOString(),
                end: new Date(data.period.end).toISOString(),
            },
            identifier: {
                system: "urn:ietf:rfc:3986"
            },
            participant: [
                {
                    individual: { reference: `${practitionerID}` }
                }
            ],
        };

        formattedData.length = parseFloat(formattedData.length);

        formattedData.diagnosis.forEach(diagnosis => {
            diagnosis.rank = parseInt(diagnosis.rank);
        });

        await addEncounter(formattedData, {
            onSettled: () => {
                reset();
                onSubmitSuccess();
            }
        });
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold">Aggiungi Incontro</h2>

            <FormRow label="Stato:" error={errors.status?.message}>
                <FormSelect
                    {...register("status.coding.[0].code", { required: "Lo stato è obbligatorio" })}
                    options={statusOptions}
                />
            </FormRow>

            <FormRow label="Classe:" error={errors.class?.code?.message}>
                <FormSelect
                    {...register("class.code", { required: "La classe è obbligatoria" })}
                    options={classOptions}
                />
            </FormRow>

            {typeFields.map((item, index) => (
                <div key={item.id} className="mb-2 space-y-2 border p-2">
                    <h4 className="text-lg font-medium">Tipo {index + 1}</h4>
                    <FormRow label="Codice:" error={errors.type?.[index]?.coding?.[0]?.code?.message}>
                        <FormInput
                            id={`type.${index}.coding[0].code`}
                            {...register(`type.${index}.coding[0].code`, { required: "Il codice è obbligatorio" })}
                            placeholder="consultazione"
                        />
                    </FormRow>
                    <div className="flex justify-end">
                        <Button type="button" onClick={() => removeType(index)} variant="delete" size="small">
                            <FaTrash />
                        </Button>
                    </div>
                </div>
            ))}
            <div className="flex justify-center">
                <Button type="button" onClick={() => { appendType({}); setFocusIndex(typeFields.length); }} variant="secondary" size="small">
                    <FaPlus className="mr-1" /> Aggiungi Tipo
                </Button>
            </div>

            <FormRow label="Tipo di servizio:" error={errors.serviceType?.coding?.[0]?.code?.message}>
                <FormInput {...register("serviceType.coding[0].code")} placeholder="assistenza primaria" />
            </FormRow>

            <FormRow label="Priorità:" error={errors.priority?.coding?.[0]?.code?.message}>
                <FormInput {...register("priority.coding[0].code")} placeholder="urgente" />
            </FormRow>

            <FormRow label="Soggetto di riferimento:" error={errors.subject?.reference?.message}>
                <FormInput {...register("subject.reference", { required: "Il riferimento del soggetto è obbligatorio" })} placeholder="67890" />
            </FormRow>

            <FormRow label="Inizio periodo:" error={errors.period?.start?.message}>
                <input type="datetime-local" {...register("period.start", { required: "L'inizio del periodo è obbligatorio" })} />
            </FormRow>

            <FormRow label="Fine periodo:" error={errors.period?.end?.message}>
                <input type="datetime-local" {...register("period.end", { required: "La fine del periodo è obbligatoria" })} />
            </FormRow>

            <FormRow label="Durata (in secondi):" error={errors.length?.message}>
                <FormInput {...register("length.value")} placeholder="3600" />
            </FormRow>
            <div className="mb-4 border-b pb-4">
                <h3 className="mb-4 text-xl font-semibold text-cyan-950">Riferimento del motivo</h3>
                {reasonReferenceFields.map((item, index) => (
                    <div key={item.id} className="mb-2 flex space-x-2" >
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
                ))
                }
            </div>
            <div className="flex justify-center">
                <Button type="button" onClick={() => { appendReasonReference({}); setFocusIndex(reasonReferenceFields.length); }} variant="secondary" size="small">
                    <FaPlus className="mr-1" /> Aggiungi Riferimento del Motivo
                </Button>
            </div>

            {
                diagnosisFields.map((item, index) => (
                    <div key={item.id} className="mb-2 space-y-2 border p-2">
                        <h4 className="text-lg font-medium">Diagnosi {index + 1}</h4>
                        <FormRow label="Riferimento della condizione:" error={errors.diagnosis?.[index]?.condition?.reference?.message}>
                            <FormInput
                                {...register(`diagnosis.${index}.condition.reference`, { required: "Il riferimento della condizione è obbligatorio" })}
                                placeholder="123"
                            />
                        </FormRow>
                        <FormRow label="Utilizzo:" error={errors.diagnosis?.[index]?.use?.coding?.[0]?.code?.message}>
                            <FormInput {...register(`diagnosis.${index}.use.coding[0].code`)} placeholder="ricovero" />
                        </FormRow>
                        <FormRow label="Grado:" error={errors.diagnosis?.[index]?.rank?.message}>
                            <FormInput {...register(`diagnosis.${index}.rank`)} placeholder="1" type="number" />
                        </FormRow>
                        <div className="flex justify-end">
                            <Button type="button" onClick={() => removeDiagnosis(index)} variant="delete" size="small">
                                <FaTrash />
                            </Button>
                        </div>
                    </div>
                ))
            }
            <div className="flex justify-center">
                <Button type="button" onClick={() => { appendDiagnosis({}); setFocusIndex(diagnosisFields.length); }} variant="secondary" size="small">
                    <FaPlus className="mr-1" /> Aggiungi Diagnosi
                </Button>
            </div>

            <div className="flex justify-center space-x-2">
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Spinner /> : "Aggiungi Incontro"}
                </Button>
                <Button type="button" onClick={onCancel} variant="secondary">
                    Annulla
                </Button>
            </div>
        </form >
    );
};

export default AddEncounterForm;
