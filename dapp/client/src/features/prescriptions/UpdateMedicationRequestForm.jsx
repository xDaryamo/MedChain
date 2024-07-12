/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../ui/BackButton";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import { useUpdatePrescription, useGetPrescription } from "./usePrescriptions";

const quantityUnitOptions = [
    { value: "tablets", label: "Tablets" },
    { value: "capsules", label: "Capsules" },
    { value: "ml", label: "Milliliters" },
];

const durationUnitOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "hours", label: "Hours" },
];

const UpdateMedicationRequestForm = () => {
    const { id } = useParams();
    const { prescription, isPending: prescriptionLoading } = useGetPrescription(id);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const { updatePrescription, isPending: updatePending } = useUpdatePrescription();
    const navigate = useNavigate();

    useEffect(() => {
        if (prescription) {
            reset(prescription);
        }
    }, [prescription, reset]);

    const onSubmit = async (data) => {
        try {
            if (!prescription) {
                console.error("Prescription is undefined");
                return;
            }

            const updatedPrescription = buildUpdatedPrescription(data);

            updatePrescription(
                { id, prescription: updatedPrescription },
                {
                    onSettled: async () => {
                        reset(updatedPrescription);
                        navigate(-1);
                    },
                }
            );
        } catch (error) {
            console.error("Error submitting prescription:", error);
        }
    };

    const buildUpdatedPrescription = (data) => {
        const medicationCodeableConcept = {
            coding: [{
                system: prescription.prescription.medicationCodeableConcept.coding[0].system,
                code: prescription.prescription.medicationCodeableConcept.coding[0].code,
                display: prescription.prescription.medicationCodeableConcept.coding[0].display
            }],
            text: prescription.prescription.medicationCodeableConcept.text || ""
        };

        const buildTiming = (repeat) => ({
            frequency: repeat?.frequency,
            periodUnit: repeat?.periodUnit
        });

        const dispenseRequest = {
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
            }

        };

        return {
            identifier: {
                system: prescription.prescription.identifier.system,
                value: prescription.prescription.identifier.value,
            },
            status: prescription.prescription.status,
            intent: prescription.prescription.intent,
            medicationCodeableConcept: medicationCodeableConcept,
            requester: prescription.prescription.requester,
            authoredOn: prescription.prescription.authoredOn,
            subject: {
                reference: prescription.prescription.subject.reference,
                display: prescription.prescription.subject.display
            },
            dosageInstruction: (data.dosageInstruction || []).map((dosage, index) => ({
                text: dosage.text || "",
                route: {
                    text: dosage.route?.text || ""
                },
                timing: buildTiming(dosage.timing?.repeat)
            })),
            dispenseRequest: dispenseRequest,
        };
    };

    if (prescriptionLoading) return <Spinner />;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div>
                <BackButton onClick={() => navigate(-1)}>Back</BackButton>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Heading>Update Medication Request</Heading>

                {/* Dosage Instructions */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Dosage Instructions</h3>

                    <FormRow
                        label={`Dosage`}
                        error={errors.dosageInstruction?.[0]?.message}
                    >
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Text
                            </label>
                            <FormInput
                                type="text"
                                {...register(`dosageInstruction[0].text`)}
                                defaultValue={prescription.prescription.dosageInstruction[0].text}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Route
                            </label>
                            <FormInput
                                type="text"
                                {...register(`dosageInstruction[0].route.text`)}
                                defaultValue={prescription.prescription.dosageInstruction[0].route?.text}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Frequency
                            </label>
                            <FormInput
                                type="number"
                                {...register(`dosageInstruction[0].timing.repeat.frequency`, { valueAsNumber: true })}
                                defaultValue={prescription.prescription.dosageInstruction[0].timing?.repeat?.frequency}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Period Unit
                            </label>
                            <FormSelect
                                {...register(`dosageInstruction[${0}].timing.repeat.periodUnit`)}
                                defaultValue={prescription.prescription.dosageInstruction[0].timing?.repeat?.periodUnit}
                                options={durationUnitOptions}
                            />
                        </div>
                    </FormRow>


                </div>

                {/* Dispense Request */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Dispense Request</h3>

                    <FormRow>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity Value
                            </label>
                            <FormInput
                                type="number"
                                {...register(`dispenseRequest.quantity.value`, { valueAsNumber: true })}
                                defaultValue={prescription.prescription.dispenseRequest.quantity?.value}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity Unit
                            </label>
                            <FormSelect
                                {...register(`dispenseRequest.quantity.unit`)}
                                defaultValue={prescription.prescription.dispenseRequest.quantity?.unit}
                                options={quantityUnitOptions}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Validity Period Start
                            </label>
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.start`)}
                                defaultValue={prescription.prescription.dispenseRequest.validityPeriod?.start}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Validity Period End
                            </label>
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.end`)}
                                defaultValue={prescription.prescription.dispenseRequest.validityPeriod?.end}
                            />
                        </div>
                    </FormRow>
                    <FormRow
                        label="Expected Supply Duration:"
                        error={errors?.dispenseRequest?.expectedSupplyDuration?.value?.message}
                    >
                        <FormInput
                            type="number"
                            {...register(
                                `dispenseRequest.expectedSupplyDuration.value`,
                                {
                                    required: "Expected supply duration value is required",
                                    valueAsNumber: true,
                                },
                            )}
                            placeholder="7"
                        />
                    </FormRow>
                    <FormRow
                        label="Expected Supply Duration Unit:"
                        error={errors?.dispenseRequest?.expectedSupplyDuration?.unit?.message}
                    >
                        <FormSelect
                            {...register("dispenseRequest.expectedSupplyDuration.unit", {
                                required: "Expected supply duration unit is required",
                            })}
                            options={[
                                { value: "", label: "Select a unit" },
                                ...durationUnitOptions,
                            ]}
                        />
                    </FormRow>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={updatePending}
                    >
                        {updatePending ? <Spinner size="small" /> : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMedicationRequestForm;
