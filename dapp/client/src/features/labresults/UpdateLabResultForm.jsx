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
import { useUpdateLabResult, useGetLabResult } from "./useLabResults";

const UpdateLabResultForm = () => {
    const { id } = useParams();
    const { labResult, isPending: labResultLoading } = useGetLabResult(id);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const { updateResult, isPending: updatePending } = useUpdateLabResult();
    const navigate = useNavigate();

    useEffect(() => {
        if (labResult) {
            reset(labResult.labResult);
        }
    }, [labResult, reset]);

    const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({ control, name: "category" });
    const { fields: performerFields, append: appendPerformer, remove: removePerformer } = useFieldArray({ control, name: "performer" });
    const { fields: noteFields, append: appendNote, remove: removeNote } = useFieldArray({ control, name: "note" });
    const { fields: componentFields, append: appendComponent, remove: removeComponent } = useFieldArray({ control, name: "components" });
    const formSections = [
        {
            label: "Category",
            errorKey: "category",
            fields: categoryFields.map((category, index) => ({
                label: `Category ${index + 1}`,
                inputs: [
                    { name: "coding.0.code", defaultValue: category.coding?.[0]?.code || "", label: "Code" },
                    { name: "coding.0.display", defaultValue: category.coding?.[0]?.display || "", label: "Display" },
                    { name: "text", defaultValue: category.text || "", label: "Text" },
                ],
            })),
            append: appendCategory,
            remove: removeCategory,
        },
        {
            label: "Performer",
            errorKey: "performer",
            fields: performerFields.map((performer, index) => ({
                label: `Performer ${index + 1}`,
                inputs: [
                    { name: "reference", defaultValue: performer?.reference || "", label: "Reference" },
                    { name: "display", defaultValue: performer?.display || "", label: "Display" },
                ],
            })),
            append: appendPerformer,
            remove: removePerformer,
        },
        {
            label: "Note",
            errorKey: "note",
            fields: noteFields.map((note, index) => ({
                label: `Note ${index + 1}`,
                inputs: [
                    { name: "text", defaultValue: note?.text || "", label: "Text" },
                    { name: "authorReference.reference", defaultValue: note?.authorReference?.reference || "", label: "Author Reference" },
                    { name: "authorReference.display", defaultValue: note?.authorReference?.display || "", label: "Author Display" },
                    { name: "time", defaultValue: note?.time || "", label: "Time" },
                ],
            })),
            append: appendNote,
            remove: removeNote,
        }
    ];

    const onSubmit = async (data) => {
        try {
            if (!labResult) {
                console.error("Lab result is undefined");
                return;
            }

            const updatedLabResult = buildUpdatedLabResult(data);

            updateResult(
                { id, labResult: updatedLabResult },
                {
                    onSettled: async () => {
                        reset(updatedLabResult);
                        console.log("Lab Result:", updatedLabResult);
                    },
                }
            );
        } catch (error) {
            console.error("Error submitting lab result:", error);
        }
    };

    const buildUpdatedLabResult = (data) => {
        const defaultDate = new Date().toISOString();

        const codeCoding = {
            system: data.codeSystem || labResult.labResult.code?.coding?.[0]?.system || "",
            code: data.code?.coding?.[0]?.code?.text || labResult.labResult.code?.coding?.[0]?.code?.text || "",
            display: data.codeDisplay || labResult.labResult.code?.coding?.[0]?.display || ""
        };

        const buildAuthorReference = (authorReference) => ({
            reference: authorReference?.reference || "",
            display: authorReference?.display || ""
        });

        return {
            identifier: {
                system: labResult.labResult.identifier?.system || "",
                value: id,
            },
            status: data.status || labResult.labResult.status || "",
            category: data.category || labResult.labResult.category || [],
            code: {
                coding: [codeCoding],
                text: data.codeText || labResult.labResult.code?.text || "",
            },
            subject: {
                reference: labResult.labResult.subject?.reference || "",
                display: labResult.labResult.subject?.display || "",
            },
            encounter: {
                reference: labResult.labResult.encounter?.reference || "",
                display: labResult.labResult.encounter?.display || "",
            },
            effectivePeriod: {
                start: labResult.labResult.effectivePeriod?.start || "",
                end: labResult.labResult.effectivePeriod?.end || "",
            },
            issued: labResult.labResult.issued || defaultDate,
            performer: (data.performer || []).map((performer, index) => ({
                reference: performer.reference || labResult.labResult.performer?.[index]?.reference || "",
                display: performer.display || labResult.labResult.performer?.[index]?.display || "",
            })),
            interpretation: (data.interpretation || []).map((interpretation) => ({
                coding: [
                    {
                        system: interpretation.system || "",
                        code: interpretation.code || "",
                        display: interpretation.display || "",
                    },
                ],
                text: interpretation.text || "",
            })),
            note: (data.note || []).map((note) => ({
                text: note.text || "",
                authorReference: buildAuthorReference(note.authorReference),
                time: note.time || defaultDate,
            })),
            components: data.components || labResult.labResult.components,
        };
    };

    if (labResultLoading) return <Spinner />;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div>
                <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Heading>Modifica Risultato di Laboratorio</Heading>

                <div className="mb-4">
                    <FormRow label="Status" error={errors.status?.message}>
                        <FormInput
                            type="text"
                            {...register("status")}
                            defaultValue={labResult?.labResult?.status || ""}
                        />
                    </FormRow>
                </div>

                {/* Render Form Sections */}
                {formSections.map((section, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                        <h3 className="mb-4 text-xl font-semibold text-cyan-950">{section.label}</h3>
                        {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="mb-4">
                                <FormRow
                                    label={field.label}
                                    error={errors[section.errorKey]?.[fieldIndex]?.message}
                                >
                                    {field.inputs.map((input, inputIndex) => (
                                        <div key={inputIndex} className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {input.label}
                                            </label>
                                            <FormInput
                                                type="text"
                                                {...register(`${section.errorKey}[${fieldIndex}].${input.name}`)}
                                                defaultValue={input.defaultValue}
                                            />
                                        </div>
                                    ))}
                                </FormRow>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="small"
                                    onClick={() => section.remove(fieldIndex)}
                                >
                                    Remove {section.label}
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            size="small"
                            onClick={() => section.append({})}
                        >
                            Add {section.label}
                        </Button>
                    </div>
                ))}

                {/* Render Components Section */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="mb-4 text-xl font-semibold text-cyan-950">Components</h3>
                    {componentFields.map((components, index) => (
                        <div key={index} className="mb-4">
                            <FormRow
                                label={`Component ${index + 1}`}
                                error={errors.components?.[index]?.message}
                            >
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Code</label>
                                        <FormInput
                                            type="text"
                                            {...register(`components[${index}].code.coding.[0].code`)}
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Display</label>
                                        <FormInput
                                            type="text"
                                            {...register(`components[${index}].code.coding.[0].display`)}
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Text</label>
                                        <FormInput
                                            type="text"
                                            {...register(`components[${index}].code.text`)}
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Quantity Value</label>
                                        <FormInput
                                            type="number"
                                            {...register(
                                                `components[${index}].valueQuantity.value`,
                                                {
                                                    valueAsNumber: true,
                                                },
                                            )}
                                            defaultValue={components?.[index]?.valueQuantity?.value || 0}
                                        />

                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Quantity Unit</label>
                                        <FormInput
                                            type="text"
                                            {...register(`components[${index}].valueQuantity.unit`)}
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Quantity System</label>
                                        <FormInput
                                            type="text"
                                            {...register(`components[${index}].valueQuantity.system`)}
                                            defaultValue={""}
                                        />
                                    </div>

                                </div>
                            </FormRow>
                            <Button
                                type="button"
                                variant="danger"
                                size="small"
                                onClick={() => removeComponent(index)}
                            >
                                Remove Component
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() => appendComponent({})}
                    >
                        Add Component
                    </Button>
                </div>

                {/* Submit Button */}
                <div className="flex w-full justify-center space-x-4">
                    <Button
                        type="submit"
                        disabled={updatePending}
                        variant="primary"
                        size="large"
                    >
                        {updatePending ? <Spinner /> : "Modifica"}
                    </Button>
                </div>

                {/* Display Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 text-red-500">
                        {Object.keys(errors).map((errorKey) => (
                            <div key={errorKey}>
                                {errors[errorKey]?.message ||
                                    `There is an error in the field ${errorKey}`}
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UpdateLabResultForm;
