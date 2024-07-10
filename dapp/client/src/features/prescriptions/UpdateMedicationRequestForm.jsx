import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useUpdatePrescription } from "./usePrescriptions";

const quantityUnitOptions = [
    { value: "tablets", label: "Tablets" },
    { value: "capsules", label: "Capsules" },
    { value: "ml", label: "Milliliters" },
];

const durationUnitOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
];

const UpdateMedicationRequestForm = ({ medicationRequest, onUpdate, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: medicationRequest,
    });

    const { updateMedicationRequest, isPending } = useUpdatePrescription();

    const onSubmit = async (data) => {
        const updatedMedicationRequest = {
            ...medicationRequest,
            ...data
        };

        try {
            await updateMedicationRequest(medicationRequest.identifier.value, updatedMedicationRequest);
            reset();
            onUpdate();
        } catch (err) {
            console.error("Error updating medication request:", err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold">Update Medication Request</h2>

            <div className="mb-4 border-b pb-4">
                <div className="mb-2 space-y-2 border p-2">
                    <h4 className="text-lg font-medium">Medication Request</h4>

                    {/* Medication Codeable Concept */}
                    <FormRow
                        label="Medication Code System:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.system?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].system", {
                                required: "Medication code system is required",
                            })}
                            placeholder="http://snomed.info/sct"
                        />
                    </FormRow>
                    <FormRow
                        label="Medication Code Value:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].code", {
                                required: "Medication code value is required",
                            })}
                            placeholder="80146002"
                        />
                    </FormRow>
                    <FormRow
                        label="Medication Code Display:"
                        error={errors?.medicationCodeableConcept?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.coding[0].display", {
                                required: "Medication code display is required",
                            })}
                            placeholder="Ibuprofen"
                        />
                    </FormRow>
                    <FormRow
                        label="Medication Code Text:"
                        error={errors?.medicationCodeableConcept?.text?.message}
                    >
                        <FormInput
                            {...register("medicationCodeableConcept.text", {
                                required: "Medication code text is required",
                            })}
                            placeholder="Ibuprofen"
                        />
                    </FormRow>

                    {/* Dosage Instruction */}
                    <FormRow
                        label="Dosage Instruction Text:"
                        error={errors?.dosageInstruction?.[0]?.text?.message}
                    >
                        <FormInput
                            {...register("dosageInstruction[0].text", {
                                required: "Dosage instruction text is required",
                            })}
                            placeholder="Take 1 tablet twice daily"
                        />
                    </FormRow>

                    {/* Dispense Request */}
                    <FormRow
                        label="Dispense Quantity:"
                        error={errors?.dispenseRequest?.quantity?.value?.message}
                    >
                        <FormInput
                            {...register("dispenseRequest.quantity.value", {
                                required: "Dispense quantity value is required",
                            })}
                            placeholder="30"
                        />
                    </FormRow>
                    <FormRow
                        label="Dispense Quantity Unit:"
                        error={errors?.dispenseRequest?.quantity?.unit?.message}
                    >
                        <FormSelect
                            {...register("dispenseRequest.quantity.unit", {
                                required: "Dispense quantity unit is required",
                            })}
                            options={[
                                { value: "", label: "Select a unit" },
                                ...quantityUnitOptions,
                            ]}
                        />
                    </FormRow>
                    <FormRow
                        label="Expected Supply Duration:"
                        error={errors?.dispenseRequest?.expectedSupplyDuration?.value?.message}
                    >
                        <FormInput
                            {...register("dispenseRequest.expectedSupplyDuration.value", {
                                required: "Expected supply duration value is required",
                            })}
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

                    {/* Status */}
                    <FormRow
                        label="Status Code:"
                        error={errors?.status?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("status.coding[0].code", {
                                required: "Status code is required",
                            })}
                            placeholder="active"
                        />
                    </FormRow>
                    <FormRow
                        label="Status Display:"
                        error={errors?.status?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("status.coding[0].display", {
                                required: "Status display is required",
                            })}
                            placeholder="Active"
                        />
                    </FormRow>
                    <FormRow
                        label="Status Text:"
                        error={errors?.status?.text?.message}
                    >
                        <FormInput
                            {...register("status.text", {
                                required: "Status text is required",
                            })}
                            placeholder="Active"
                        />
                    </FormRow>
                </div>
            </div>

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

export default UpdateMedicationRequestForm;
