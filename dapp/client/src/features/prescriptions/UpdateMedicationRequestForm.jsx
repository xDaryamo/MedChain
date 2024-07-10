import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useUpdateMedicationRequest } from "./useMedicationRequests";
import Spinner from "../../ui/Spinner";

const UpdateMedicationRequestForm = ({ medicationRequest, onUpdate, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: medicationRequest,
    });

    const { updateMedicationRequest, isPending } = useUpdateMedicationRequest();

    const onSubmit = async (data) => {
        const updatedMedicationRequest = {
            ...medicationRequest,
            dosageInstruction: data.dosageInstruction || [],
            dispenseRequest: data.dispenseRequest || {},
            status: data.status || {},
            intent: data.intent || {}
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

            {/* Dosage Instruction */}
            <FormRow
                label="Dosage Instruction"
                error={errors.dosageInstruction?.[0]?.text?.message}
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
                label="Dispense Request"
                error={errors.dispenseRequest?.quantity?.value?.message ||
                    errors.dispenseRequest?.quantity?.unit?.message ||
                    errors.dispenseRequest?.expectedSupplyDuration?.value?.message}
            >
                <FormInput
                    {...register("dispenseRequest.quantity.value", {
                        required: "Dispense quantity value is required",
                    })}
                    placeholder="Quantity Value"
                />
                <FormInput
                    {...register("dispenseRequest.quantity.unit", {
                        required: "Dispense quantity unit is required",
                    })}
                    placeholder="Quantity Unit"
                />
                <FormInput
                    {...register("dispenseRequest.expectedSupplyDuration.value", {
                        required: "Expected supply duration value is required",
                    })}
                    placeholder="Supply Duration"
                />
            </FormRow>

            {/* Status */}
            <FormRow
                label="Status"
                error={errors.status?.coding?.[0]?.code?.message ||
                    errors.status?.coding?.[0]?.display?.message ||
                    errors.status?.text?.message}
            >
                <FormInput
                    {...register("status.coding[0].code", {
                        required: "Status code is required",
                    })}
                    placeholder="Status Code"
                />
                <FormInput
                    {...register("status.coding[0].display", {
                        required: "Status display is required",
                    })}
                    placeholder="Status Display"
                />
                <FormInput
                    {...register("status.text", {
                        required: "Status text is required",
                    })}
                    placeholder="Status Text"
                />
            </FormRow>

            {/* Intent */}
            <FormRow
                label="Intent"
                error={errors.intent?.coding?.[0]?.code?.message ||
                    errors.intent?.coding?.[0]?.display?.message ||
                    errors.intent?.text?.message}
            >
                <FormInput
                    {...register("intent.coding[0].code", {
                        required: "Intent code is required",
                    })}
                    placeholder="Intent Code"
                />
                <FormInput
                    {...register("intent.coding[0].display", {
                        required: "Intent display is required",
                    })}
                    placeholder="Intent Display"
                />
                <FormInput
                    {...register("intent.text", {
                        required: "Intent text is required",
                    })}
                    placeholder="Intent Text"
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

export default UpdateMedicationRequestForm;
