import { useForm, useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useAddPrescription } from "./usePrescriptions";

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
            <h2 className="mb-6 text-2xl font-bold">Add a New Prescription</h2>

            <div className="mb-4 border-b pb-4">
                <div className="mb-2 space-y-2 border p-2">
                    <h4 className="text-lg font-medium">Prescription Details</h4>

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
                    {dosageInstructionFields.map((item, index) => (
                        <div key={item.id} className="mb-4 border p-4">
                            <h4 className="text-lg font-medium">Dosage Instruction {index + 1}</h4>
                            <FormRow
                                label="Dosage Instruction Text:"
                                error={errors?.dosageInstruction?.[index]?.text?.message}
                            >
                                <FormInput
                                    {...register(`dosageInstruction[${index}].text`, {
                                        required: `Dosage instruction ${index + 1} text is required`,
                                    })}
                                    placeholder="Take 1 tablet twice daily"
                                />
                            </FormRow>
                            <FormRow
                                label="Timing Frequency:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.frequency?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(`dosageInstruction[${index}].timing.repeat.frequency`, {
                                        required: `Dosage instruction ${index + 1} timing frequency is required`,
                                        valueAsNumber: true,
                                    })}
                                    placeholder="2"
                                />
                            </FormRow>
                            <FormRow
                                label="Timing Period:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.period?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(`dosageInstruction[${index}].timing.repeat.period`, {
                                        required: `Dosage instruction ${index + 1} timing period is required`,
                                        valueAsNumber: true,
                                    })}
                                    placeholder="1"
                                />
                            </FormRow>
                            <FormRow
                                label="Timing Period Unit:"
                                error={errors?.dosageInstruction?.[index]?.timing?.repeat?.periodUnit?.message}
                            >
                                <FormSelect
                                    {...register(`dosageInstruction[${index}].timing.repeat.periodUnit`, {
                                        required: `Dosage instruction ${index + 1} timing period unit is required`,
                                    })}
                                    options={[
                                        { value: "", label: "Select a unit" },
                                        ...durationUnitOptions,
                                    ]}
                                />
                            </FormRow>
                            <FormRow
                                label="Route:"
                                error={errors?.dosageInstruction?.[index]?.route?.text?.message}
                            >
                                <FormInput
                                    {...register(`dosageInstruction[${index}].route.text`, {
                                        required: `Dosage instruction ${index + 1} route is required`,
                                    })}
                                    placeholder="Oral"
                                />
                            </FormRow>
                            <FormRow
                                label="Dose Quantity Value:"
                                error={errors?.dosageInstruction?.[index]?.doseQuantity?.value?.message}
                            >
                                <FormInput
                                    type="number"
                                    {...register(
                                        `dosageInstruction[${index}].doseQuantity.value`,
                                        {
                                            required: `Dosage instruction ${index + 1} dose quantity value is required`,
                                            valueAsNumber: true,
                                        },
                                    )}
                                    placeholder="1"
                                />
                            </FormRow>
                            <FormRow
                                label="Dose Quantity Unit:"
                                error={errors?.dosageInstruction?.[index]?.doseQuantity?.unit?.message}
                            >
                                <FormSelect
                                    {...register(`dosageInstruction[${index}].doseQuantity.unit`, {
                                        required: `Dosage instruction ${index + 1} dose quantity unit is required`,
                                    })}
                                    options={[
                                        { value: "", label: "Select a unit" },
                                        ...quantityUnitOptions,
                                    ]}
                                />
                            </FormRow>
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={() => removeDosageInstruction(index)}
                                >
                                    Remove Dosage Instruction
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendDosageInstruction({})}>
                        Add Dosage Instruction
                    </Button>

                    {/* Dispense Request */}
                    <FormRow
                        label="Dispense Quantity:"
                        error={errors?.dispenseRequest?.quantity?.value?.message}
                    >
                        <FormInput
                            type="number"
                            {...register(
                                `dispenseRequest.quantity.value`,
                                {
                                    required: "Dispense quantity value is required",
                                    valueAsNumber: true,
                                },
                            )}
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

                    <FormRow
                        label=" Validity Period Start:"
                        error={errors?.dispenseRequest?.validityPeriod?.start?.message}
                    >
                        <div className="mb-2">
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.start`, {
                                    required: "Expected supply duration unit is required",
                                })}
                            />
                        </div>
                    </FormRow>
                    <FormRow
                        label=" Validity Period End:"
                        error={errors?.dispenseRequest?.validityPeriod?.end?.message}
                    >
                        <div className="mb-2">
                            <FormInput
                                type="datetime-local"
                                {...register(`dispenseRequest.validityPeriod.end`, {
                                    required: "Expected supply duration unit is required",
                                })}
                            />
                        </div>
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

            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="secondary">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isPending}>
                    {isPending ? <Spinner size="small" /> : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default AddMedicationRequestForm;
