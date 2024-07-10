import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useAddPrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";

const AddMedicationRequestForm = ({ onSubmitSuccess }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { addMedicationRequest, isPending } = useAddPrescription();

    const onSubmit = async (data) => {
        const medicationRequest = {
            ...data,
            identifier: {
                system: "urn:ietf:rfc:3986"
            },
        };

        await addMedicationRequest(medicationRequest, {
            onSettled: () => {
                reset();
                onSubmitSuccess();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="mb-6 text-2xl font-bold">Add New Medication Request</h2>

            <div className="mb-4 border-b pb-4">
                <div className="mb-2 space-y-2 border p-2">
                    <h4 className="text-lg font-medium">
                        Medication Request
                    </h4>
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

                    {/* Subject */}
                    <FormRow
                        label="Subject Reference:"
                        error={errors?.subject?.reference?.message}
                    >
                        <FormInput
                            {...register("subject.reference", {
                                required: "Subject reference is required",
                            })}
                            placeholder="Patient/67890"
                        />
                    </FormRow>
                    <FormRow
                        label="Subject Display:"
                        error={errors?.subject?.display?.message}
                    >
                        <FormInput
                            {...register("subject.display", {
                                required: "Subject display is required",
                            })}
                            placeholder="John Doe"
                        />
                    </FormRow>

                    {/* Authored On */}
                    <FormRow
                        label="Authored On:"
                        error={errors?.authoredOn?.message}
                    >
                        <input
                            type="datetime-local"
                            {...register("authoredOn", {
                                required: "Authored On is required",
                            })}
                        />
                    </FormRow>

                    {/* Requester */}
                    <FormRow
                        label="Requester Reference:"
                        error={errors?.requester?.reference?.message}
                    >
                        <FormInput
                            {...register("requester.reference", {
                                required: "Requester reference is required",
                            })}
                            placeholder="Practitioner/123"
                        />
                    </FormRow>
                    <FormRow
                        label="Requester Display:"
                        error={errors?.requester?.display?.message}
                    >
                        <FormInput
                            {...register("requester.display", {
                                required: "Requester display is required",
                            })}
                            placeholder="Dr. Smith"
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
                        <FormInput
                            {...register("dispenseRequest.quantity.unit", {
                                required: "Dispense quantity unit is required",
                            })}
                            placeholder="tablets"
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

                    {/* Intent */}
                    <FormRow
                        label="Intent Code:"
                        error={errors?.intent?.coding?.[0]?.code?.message}
                    >
                        <FormInput
                            {...register("intent.coding[0].code", {
                                required: "Intent code is required",
                            })}
                            placeholder="proposal"
                        />
                    </FormRow>
                    <FormRow
                        label="Intent Display:"
                        error={errors?.intent?.coding?.[0]?.display?.message}
                    >
                        <FormInput
                            {...register("intent.coding[0].display", {
                                required: "Intent display is required",
                            })}
                            placeholder="Proposal"
                        />
                    </FormRow>
                    <FormRow
                        label="Intent Text:"
                        error={errors?.intent?.text?.message}
                    >
                        <FormInput
                            {...register("intent.text", {
                                required: "Intent text is required",
                            })}
                            placeholder="Proposal"
                        />
                    </FormRow>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending ? <Spinner size="small" /> : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default AddMedicationRequestForm;
