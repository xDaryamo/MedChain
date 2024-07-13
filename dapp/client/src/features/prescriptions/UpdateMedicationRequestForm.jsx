/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import BackButton from "../../ui/BackButton";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import { useUpdatePrescription, useGetPrescription } from "./usePrescriptions";

const optionsUnitaQuantita = [
    { value: "compresse", label: "Compresse" },
    { value: "capsule", label: "Capsule" },
    { value: "ml", label: "Millilitri" },
];

const optionsUnitaDurata = [
    { value: "giorni", label: "Giorni" },
    { value: "settimane", label: "Settimane" },
    { value: "mesi", label: "Mesi" },
    { value: "ore", label: "Ore" },
];

const UpdateMedicationRequestForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { prescription, isPending: prescriptionLoading } = useGetPrescription(id);
    const { updatePrescription, isPending: updatePending } = useUpdatePrescription();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm();

    const {
        fields: dosageInstructionFields,
        append: appendDosageInstruction,
        remove: removeDosageInstruction,
    } = useFieldArray({
        control,
        name: "dosageInstruction",
    });

    useEffect(() => {
        if (prescription) {
            reset(buildFormattedData(prescription));
        }
    }, [prescription, reset]);

    const buildFormattedData = (prescription) => {
        if (!prescription || !prescription.dosageInstruction) {
            return {
                dosageInstruction: [],
                dispenseRequest: {
                    quantity: { value: "", unit: "" },
                    validityPeriod: { start: "", end: "" },
                    expectedSupplyDuration: { value: "", unit: "" },
                },
            };
        }

        return {
            dosageInstruction: prescription.dosageInstruction.map((dosage) => ({
                text: dosage.text || "",
                route: { text: dosage.route?.text || "" },
                timing: {
                    repeat: {
                        frequency: dosage.timing?.repeat?.frequency || "",
                        periodUnit: dosage.timing?.repeat?.periodUnit || "",
                    },
                },
            })),
            dispenseRequest: {
                quantity: {
                    value: prescription.dispenseRequest?.quantity?.value || "",
                    unit: prescription.dispenseRequest?.quantity?.unit || "",
                },
                validityPeriod: {
                    start: prescription.dispenseRequest?.validityPeriod?.start || "",
                    end: prescription.dispenseRequest?.validityPeriod?.end || "",
                },
                expectedSupplyDuration: {
                    value: prescription.dispenseRequest?.expectedSupplyDuration?.value || "",
                    unit: prescription.dispenseRequest?.expectedSupplyDuration?.unit || "",
                },
            },
        };
    };

    const onSubmit = async (data) => {
        const updatedPrescription = {
            identifier: {
                system: prescription.prescription.identifier.system
            },
            authoredOn: new Date(prescription.prescription.authoredOn).toISOString(),
            requester: {
                reference: prescription.prescription.requester.reference,
                display: prescription.prescription.requester.display
            },
            medicationCodeableConcept: {
                coding: [
                    {
                        system: prescription.prescription.medicationCodeableConcept.coding[0].system,
                        code: prescription.prescription.medicationCodeableConcept.coding[0].code,
                        display: prescription.prescription.medicationCodeableConcept.coding[0].display,
                    },
                ],
                text: prescription.prescription.medicationCodeableConcept.text
            },
            subject: {
                reference: prescription.prescription.subject.reference,
                display: prescription.prescription.subject.display
            },
            intent: {
                coding: [
                    {
                        system: prescription.prescription.intent.coding[0].system,
                        code: prescription.prescription.intent.coding[0].code,
                        display: prescription.prescription.intent.coding[0].display,
                    },
                ],
                text: prescription.prescription.intent.text
            },
            status: {
                coding: [
                    {
                        system: prescription.prescription.status.coding[0].system,
                        code: prescription.prescription.status.coding[0].code,
                        display: prescription.prescription.status.coding[0].display,
                    },
                ],
                text: prescription.prescription.status.text
            },
            dosageInstruction: data.dosageInstruction.map((dosage) => ({
                text: dosage.text || "",
                route: { text: dosage.route?.text || "" },
                timing: {
                    repeat: {
                        frequency: dosage.timing?.repeat?.frequency || "",
                        periodUnit: dosage.timing?.repeat?.periodUnit || "",
                    },
                },
            })),
            dispenseRequest: {
                quantity: {
                    value: data.dispenseRequest.quantity.value,
                    unit: data.dispenseRequest.quantity.unit,
                },
                validityPeriod: {
                    start: new Date(data.dispenseRequest.validityPeriod.start).toISOString(),
                    end: new Date(data.dispenseRequest.validityPeriod.end).toISOString(),
                },
                expectedSupplyDuration: {
                    value: data.dispenseRequest.expectedSupplyDuration.value,
                    unit: data.dispenseRequest.expectedSupplyDuration.unit,
                },
            },
        };

        updatePrescription(
            { id, prescription: updatedPrescription },
            {
                onSettled: async () => {
                    reset(buildFormattedData(updatedPrescription));
                    navigate(-1);
                },
            }
        );
    };

    if (prescriptionLoading) return <Spinner />;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div>
                <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Heading>Modifica Richiesta Medicinale</Heading>

                {/* Istruzioni Dosaggio */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Istruzioni Dosaggio</h3>
                    {dosageInstructionFields.map((dosage, index) => (
                        <div key={dosage.id} className="mb-4">
                            <FormRow label={`Dosaggio ${index + 1}`} error={errors?.dosageInstruction?.[index]?.text?.message}>
                                <FormInput
                                    type="text"
                                    {...register(`dosageInstruction[${index}].text`)}
                                    defaultValue={dosage.text}
                                />
                                <FormInput
                                    type="text"
                                    {...register(`dosageInstruction[${index}].route.text`)}
                                    defaultValue={dosage.route?.text}
                                />
                                <FormInput
                                    type="number"
                                    {...register(`dosageInstruction[${index}].timing.repeat.frequency`, { valueAsNumber: true })}
                                    defaultValue={dosage.timing?.repeat?.frequency}
                                />
                                <FormSelect
                                    {...register(`dosageInstruction[${index}].timing.repeat.periodUnit`)}
                                    defaultValue={dosage.timing?.repeat?.periodUnit}
                                    options={optionsUnitaDurata}
                                />
                                <Button
                                    type="button"
                                    variant="delete"
                                    onClick={() => removeDosageInstruction(index)}
                                    size="small"
                                >
                                    Elimina
                                </Button>
                            </FormRow>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() => appendDosageInstruction({})}
                            variant="secondary"
                            size="small"
                        >
                            Aggiungi Istruzione Dosaggio
                        </Button>
                    </div>
                </div>

                {/* Richiesta Dispensa */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Richiesta Dispensa</h3>
                    <FormRow label="Valore Quantità" error={errors?.dispenseRequest?.quantity?.value?.message}>
                        <FormInput
                            type="number"
                            {...register(`dispenseRequest.quantity.value`, { valueAsNumber: true })}
                            defaultValue={prescription?.dispenseRequest?.quantity?.value}
                        />
                    </FormRow>
                    <FormRow label="Unità Quantità">
                        <FormSelect
                            {...register(`dispenseRequest.quantity.unit`)}
                            defaultValue={prescription?.dispenseRequest?.quantity?.unit}
                            options={optionsUnitaQuantita}
                        />
                    </FormRow>
                    <FormRow label="Periodo di Validità Inizio">
                        <FormInput
                            type="datetime-local"
                            {...register(`dispenseRequest.validityPeriod.start`)}
                            defaultValue={prescription?.dispenseRequest?.validityPeriod?.start}
                        />
                    </FormRow>
                    <FormRow label="Periodo di Validità Fine">
                        <FormInput
                            type="datetime-local"
                            {...register(`dispenseRequest.validityPeriod.end`)}
                            defaultValue={prescription?.dispenseRequest?.validityPeriod?.end}
                        />
                    </FormRow>
                    <FormRow label="Durata Prevista Fornitura" error={errors?.dispenseRequest?.expectedSupplyDuration?.value?.message}>
                        <FormInput
                            type="number"
                            {...register(`dispenseRequest.expectedSupplyDuration.value`, { valueAsNumber: true })}
                            defaultValue={prescription?.dispenseRequest?.expectedSupplyDuration?.value}
                        />
                    </FormRow>
                    <FormRow label="Unità Durata Prevista Fornitura">
                        <FormSelect
                            {...register(`dispenseRequest.expectedSupplyDuration.unit`)}
                            defaultValue={prescription?.dispenseRequest?.expectedSupplyDuration?.unit}
                            options={optionsUnitaDurata}
                        />
                    </FormRow>
                </div>

                <div className="flex justify-center space-x-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        disabled={updatePending}
                    >
                        {updatePending ? (
                            <Spinner size="small" />
                        ) : (
                            "Modifica ricetta"
                        )}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default UpdateMedicationRequestForm;
