import { useForm, useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useAddPrescription } from "./usePrescriptions";
import { FaPlus, FaTrash } from "react-icons/fa";

const quantityUnitOptions = [
    { value: "tablets", label: "Compresse" },
    { value: "capsules", label: "Capsule" },
    { value: "ml", label: "Millilitri" },
];

const durationUnitOptions = [
    { value: "days", label: "Giorni" },
    { value: "weeks", label: "Settimane" },
    { value: "months", label: "Mesi" },
    { value: "hours", label: "Ore" },
];

const AddMedicationRequestForm = ({ onSubmitSuccess, onCancel }) => {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
    const { addPrescription, isPending } = useAddPrescription();

    const { fields: dosageInstructionFields, append: appendDosageInstruction, remove: removeDosageInstruction } = useFieldArray({
        control,
        name: "dosageInstruction",
    });

    const onSubmit = async (data) => {
        const prescription = {
            ...data,
            identifier: {
                system: "urn:ietf:rfc:3986"
            },
            authoredOn: new Date(data.authoredOn).toISOString(),
            dispenseRequest: {
                quantity: {
                    value: data.dispenseRequest.quantity.value,
                    unit: data.dispenseRequest.quantity.unit
                },
                expectedSupplyDuration: {
                    value: data.dispenseRequest.expectedSupplyDuration.value,
                    unit: data.dispenseRequest.expectedSupplyDuration.unit
                },
                validityPeriod: {
                    start: new Date(data.dispenseRequest.validityPeriod.start).toISOString(),
                    end: new Date(data.dispenseRequest.validityPeriod.end).toISOString(),
                },
            },
            dosageInstruction: data.dosageInstruction.map(dosage => ({
                ...dosage,
                doseQuantity: {
                    value: dosage.doseQuantity.value,
                    unit: dosage.doseQuantity.unit
                },
                timing: {
                    repeat: {
                        frequency: dosage.timing.repeat.frequency,
                        period: dosage.timing.repeat.period,
                        periodUnit: dosage.timing.repeat.periodUnit
                    }
                },
                route: {
                    text: dosage.route.text
                }
            }))
        };

        addPrescription(prescription, {
            onSettled: () => {
                reset();
                onSubmitSuccess();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold">Aggiungi una Nuova Prescrizione</h2>

            <div className="mb-4 border-b pb-4">
                <div className="mb-2 space-y-2 border p-2">
                    <h4 className="text-lg font-medium">Dettagli Prescrizione</h4>

                    {/* Medication Codeable Concept */}
                    <FormRow
                        label="Sistema di Codifica Medicinale:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.system?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].system", {
                                required: "Il sistema di codifica del medicinale è obbligatorio",
                            })}
                            placeholder="http://snomed.info/sct"
                        />
                    </FormRow>
                    <FormRow
                        label="Valore del Codice Medicinale:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].code", {
                                required: "Il valore del codice medicinale è obbligatorio",
                            })}
                            placeholder="80146002"
                        />
                    </FormRow>
                    <FormRow
                        label="Descrizione del Codice Medicinale:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].display", {
                                required: "La descrizione del codice medicinale è obbligatoria",
                            })}
                            placeholder="Ibuprofene"
                        />
                    </FormRow>
                    <FormRow
                        label="Testo del Codice Medicinale:"
                        error={errors?.medicationCodeableConcept?.text?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.text", {
                                required: "Il testo del codice medicinale è obbligatorio",
                            })}
                            placeholder="Ibuprofene"
                        />
                    </FormRow>

                    {/* Subject */}
                    <FormRow
                        label="Riferimento del Soggetto:"
                        error={errors?.subject?.reference?.message}
                    >
                        <FormInput
                            {...register("subject.reference", {
                                required: "Il riferimento del soggetto è obbligatorio",
                            })}
                            placeholder="67890"
                        />
                    </FormRow>
                    <FormRow
                        label="Nome del Soggetto:"
                        error={errors?.subject?.display?.message}
                    >
                        <FormInput
                            {...register("subject.display", {
                                required: "Il nome del soggetto è obbligatorio",
                            })}
                            placeholder="Mario Rossi"
                        />
                    </FormRow>

                    {/* Authored On */}
                    <FormRow
                        label="Data di Prescrizione:"
                        error={errors?.authoredOn?.message}
                    >
                        <input
                            type="datetime-local"
                            {...register("authoredOn", {
                                required: "La data di prescrizione è obbligatoria",
                            })}
                        />
                    </FormRow>

                    {/* Requester */}
                    <FormRow
                        label="Riferimento del Richiedente:"
                        error={errors?.requester?.reference?.message}
                    >
                        <FormInput
                            {...register("requester.reference", {
                                required: "Il riferimento del richiedente è obbligatorio",
                            })}
                            placeholder="123"
                        />
                    </FormRow>
                    <FormRow
                        label="Nome del Richiedente:"
                        error={errors?.requester?.display?.message}
                    >
                        <FormInput
                            {...register("requester.display", {
                                required: "Il nome del richiedente è obbligatorio",
                            })}
                            placeholder="Dott. Mario Verdi"
                        />
                    </FormRow>

                    {/* Dosage Instruction */}
                    {dosageInstructionFields.map((item, index) => (
                        <div key={item.id} className="mb-4 border p-4">
                            <h4 className="text-lg font-medium">Istruzioni di Dosaggio {index + 1}</h4>
                            <FormRow
                                label="Testo delle Istruzioni di Dosaggio:"
                                error={errors?.dosageInstruction?.[index]?.text?.message}
                            >
                                <FormInput
                                    {...register(`dosageInstruction[${index}].text`, {
                                        required: `Il testo delle istruzioni di dosaggio ${index + 1} è obbligatorio`,
                                    })}
                                    placeholder="Assumere 1 compressa due volte al giorno"
                                />
                            </FormRow>
                            <FormRow
                                label="Frequenza Temporale:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.frequency?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(`dosageInstruction[${index}].timing.repeat.frequency`, {
                                        required: `La frequenza temporale delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                                        valueAsNumber: true,
                                    })}
                                    placeholder="2"
                                />
                            </FormRow>
                            <FormRow
                                label="Periodo Temporale:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.period?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(`dosageInstruction[${index}].timing.repeat.period`, {
                                        required: `Il periodo temporale delle istruzioni di dosaggio ${index + 1} è obbligatorio`,
                                        valueAsNumber: true,
                                    })}
                                    placeholder="1"
                                />
                            </FormRow>
                            <FormRow
                                label="Unità del Periodo Temporale:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.periodUnit?.message}
                            >
                                <FormSelect
                                    {...register(`dosageInstruction[${index}].timing.repeat.periodUnit`, {
                                        required: `L'unità del periodo temporale delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                                    })}
                                    options={[
                                        { value: "", label: "Seleziona un'unità" },
                                        ...durationUnitOptions,
                                    ]}
                                />
                            </FormRow>
                            <FormRow
                                label="Via di Somministrazione:"
                                error={errors?.dosageInstruction?.[index]?.route?.text?.message}
                            >
                                <FormInput
                                    {...register(`dosageInstruction[${index}].route.text`, {
                                        required: `La via di somministrazione delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                                    })}
                                    placeholder="Orale"
                                />
                            </FormRow>
                            <FormRow
                                label="Quantità della Dose:"
                                error={errors?.dosageInstruction?.[index]?.doseQuantity?.value?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(
                                        `dosageInstruction[${index}].doseQuantity.value`,
                                        {
                                            required: `La quantità della dose delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                                            valueAsNumber: true,
                                        },
                                    )}
                                    placeholder="1"
                                />
                            </FormRow>
                            <FormRow
                                label="Unità della Dose:"
                                error={errors?.dosageInstruction?.[index]?.doseQuantity?.unit?.message}
                            >
                                <FormSelect
                                    {...register(`dosageInstruction[${index}].doseQuantity.unit`, {
                                        required: `L'unità della dose delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                                    })}
                                    options={[
                                        { value: "", label: "Seleziona un'unità" },
                                        ...quantityUnitOptions,
                                    ]}
                                />
                            </FormRow>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeDosageInstruction(index)}
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
                            onClick={() => appendDosageInstruction({})}
                            variant="secondary"
                            size="small"
                        >
                            <FaPlus className="mr-1" /> Aggiungi Istruzione di Dosaggio
                        </Button>
                    </div>



                    {/* Dispense Request */}
                    <FormRow
                        label="Quantità da Dispensare:"
                        error={errors?.dispenseRequest?.quantity?.value?.message}
                    >
                        <FormInput
                            type="number"
                            {...register(
                                `dispenseRequest.quantity.value`,
                                {
                                    required: "La quantità da dispensare è obbligatoria",
                                    valueAsNumber: true,
                                },
                            )}
                            placeholder="30"
                        />
                    </FormRow>
                    <FormRow
                        label="Unità della Quantità da Dispensare:"
                        error={errors?.dispenseRequest?.quantity?.unit?.message}
                    >
                        <FormSelect
                            {...register("dispenseRequest.quantity.unit", {
                                required: "L'unità della quantità da dispensare è obbligatoria",
                            })}
                            options={[
                                { value: "", label: "Seleziona un'unità" },
                                ...quantityUnitOptions,
                            ]}
                        />
                    </FormRow>
                    <FormRow
                        label="Durata Prevista della Scorta:"
                        error={errors?.dispenseRequest?.expectedSupplyDuration?.value?.message}
                    >
                        <FormInput
                            type="number"
                            {...register(
                                `dispenseRequest.expectedSupplyDuration.value`,
                                {
                                    required: "La durata prevista della scorta è obbligatoria",
                                    valueAsNumber: true,
                                },
                            )}
                            placeholder="7"
                        />
                    </FormRow>
                    <FormRow
                        label="Unità della Durata Prevista della Scorta:"
                        error={errors?.dispenseRequest?.expectedSupplyDuration?.unit?.message}
                    >
                        <FormSelect
                            {...register("dispenseRequest.expectedSupplyDuration.unit", {
                                required: "L'unità della durata prevista della scorta è obbligatoria",
                            })}
                            options={[
                                { value: "", label: "Seleziona un'unità" },
                                ...durationUnitOptions,
                            ]}
                        />
                    </FormRow>

                    <FormRow
                        label=" Periodo di Validità Inizio:"
                        error={errors?.dispenseRequest?.validityPeriod?.start?.message}
                    >
                        <div className="mb-2">
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.start`, {
                                    required: "La durata prevista della scorta è obbligatoria",
                                })}
                            />
                        </div>
                    </FormRow>
                    <FormRow
                        label=" Periodo di Validità Fine:"
                        error={errors?.dispenseRequest?.validityPeriod?.end?.message}
                    >
                        <div className="mb-2">
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.end`, {
                                    required: "La durata prevista della scorta è obbligatoria",
                                })}
                            />
                        </div>
                    </FormRow>

                    {/* Status */}
                    <FormRow
                        label="Codice di Stato:"
                        error={errors?.status?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("status.coding[0].code", {
                                required: "Il codice di stato è obbligatorio",
                            })}
                            placeholder="attivo"
                        />
                    </FormRow>
                    <FormRow
                        label="Descrizione dello Stato:"
                        error={errors?.status?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("status.coding[0].display", {
                                required: "La descrizione dello stato è obbligatoria",
                            })}
                            placeholder="Attivo"
                        />
                    </FormRow>
                    <FormRow
                        label="Testo dello Stato:"
                        error={errors?.status?.text?.message}
                    >
                        <FormInput
                            {...register("status.text", {
                                required: "Il testo dello stato è obbligatorio",
                            })}
                            placeholder="Attivo"
                        />
                    </FormRow>

                    {/* Intent */}
                    <FormRow
                        label="Codice dell'Intento:"
                        error={errors?.intent?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("intent.coding[0].code", {
                                required: "Il codice dell'intento è obbligatorio",
                            })}
                            placeholder="proposta"
                        />
                    </FormRow>
                    <FormRow
                        label="Descrizione dell'Intento:"
                        error={errors?.intent?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("intent.coding[0].display", {
                                required: "La descrizione dell'intento è obbligatoria",
                            })}
                            placeholder="Proposta"
                        />
                    </FormRow>
                    <FormRow
                        label="Testo dell'Intento:"
                        error={errors?.intent?.text?.message}
                    >
                        <FormInput
                            {...register("intent.text", {
                                required: "Il testo dell'intento è obbligatorio",
                            })}
                            placeholder="Proposta"
                        />
                    </FormRow>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="secondary">
                    Cancella
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending ? <Spinner size="small" /> : "Invia"}
                </Button>
            </div>
        </form>
    );
};

export default AddMedicationRequestForm;
