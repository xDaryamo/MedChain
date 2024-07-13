/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useUpdateLabResult, useGetLabResult } from "./useLabResults";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormRow from "../../ui/FormRow";
import FormSelect from "../../ui/FormSelect";
import Spinner from "../../ui/Spinner";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import BackButton from "../../ui/BackButton";
import Heading from "../../ui/Heading";

const UpdateLabResultForm = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    labResult,
    isPending: labResultLoading,
    error: labResultError,
  } = useGetLabResult(id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: [],
      interpretation: [],
      note: [],
      component: [],
    },
  });
  const { updateResult, isPending: updatePending } = useUpdateLabResult(id);

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "category",
  });

  const {
    fields: interpretationFields,
    append: appendInterpretation,
    remove: removeInterpretation,
  } = useFieldArray({
    control,
    name: "interpretation",
  });

  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: "note",
  });

  const {
    fields: componentFields,
    append: appendComponent,
    remove: removeComponent,
  } = useFieldArray({
    control,
    name: "component",
  });

  useEffect(() => {
    if (labResult) {
      const formattedData = {
        ...labResult,
        category: labResult.category?.map((cat) => ({ text: cat.text })) || [],
        code: { text: labResult.code?.text || "" },
        effectivePeriod: {
          start: labResult.effectivePeriod?.start
            ? new Date(labResult.effectivePeriod.start)
                .toISOString()
                .substring(0, 16)
            : "",
          end: labResult.effectivePeriod?.end
            ? new Date(labResult.effectivePeriod.end)
                .toISOString()
                .substring(0, 16)
            : "",
        },
        issued: labResult.issued
          ? new Date(labResult.issued).toISOString().substring(0, 16)
          : "",
        interpretation:
          labResult.interpretation?.map((interp) => ({
            text: interp.text,
          })) || [],
        note: labResult.note?.map((n) => ({ text: n.text })) || [],
        component:
          labResult.component?.map((comp) => ({
            code: { text: comp.code?.text || "" },
            valueQuantity: comp.valueQuantity?.value || "",
            unit: comp.valueQuantity?.unit || "",
            interpretation: comp.interpretation
              ?.map((interp) => interp.text)
              .join(", "),
          })) || [],
      };
      reset(formattedData);
    }
  }, [labResult, reset]);

  const onSubmit = async (data) => {
    const labresult = {
      identifier: {
        system: "http://hospital.smarthealth.org",
      },
      status: data.status,
      category: data.category.map((cat) => ({
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/observation-category",
            code: cat.text,
            display: cat.text,
          },
        ],
        text: cat.text,
      })),
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: data.code.text,
            display: data.code.text,
          },
        ],
        text: data.code.text,
      },
      subject: {
        reference: labResult.subject?.reference || "",
      },
      effectivePeriod: {
        start: new Date(data.effectivePeriod.start).toISOString(),
        end: new Date(data.effectivePeriod.end).toISOString(),
      },
      issued: new Date(data.issued).toISOString(),
      performer: [
        {
          reference: user.userId,
          display: user.username,
        },
      ],
      interpretation: data.interpretation.map((interp) => ({
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
            code: interp.text,
            display: interp.text,
          },
        ],
        text: interp.text,
      })),
      note: data.note.map((n) => ({
        text: n.text,
        time: new Date(),
        authorString: "Author",
      })),
      component: data.component.map((comp) => ({
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: comp.code.text,
              display: comp.code.text,
            },
          ],
          text: comp.code.text,
        },
        valueQuantity: {
          value: parseFloat(comp.valueQuantity),
          unit: comp.unit,
          system: "http://unitsofmeasure.org",
        },
        interpretation: comp.interpretation
          ? [
              {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                    code: comp.interpretation,
                    display: comp.interpretation,
                  },
                ],
                text: comp.interpretation,
              },
            ]
          : [],
      })),
    };

    updateResult(
      { id, labResult: labresult },
      {
        onSettled: () => {
          reset();
          navigate(-1);
        },
      },
    );
  };

  if (labResultLoading) return <Spinner />;
  if (labResultError) return <p>Error loading lab result</p>;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Heading>Modifica Risultato di Laboratorio</Heading>

        <FormRow label="Status:" error={errors.status?.message}>
          <FormSelect
            id="status"
            {...register("status", { required: "Lo status è obbligatorio" })}
            options={[
              { value: "registered", label: "Registrato" },
              { value: "preliminary", label: "Preliminare" },
              { value: "final", label: "Finale" },
              { value: "amended", label: "Modificato" },
              { value: "corrected", label: "Corretto" },
              { value: "cancelled", label: "Annullato" },
              { value: "entered-in-error", label: "Inserito per errore" },
              { value: "unknown", label: "Sconosciuto" },
            ]}
          />
        </FormRow>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Categoria
          </h3>
          {categoryFields.map((item, index) => (
            <div key={item.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`category[${index}].text`, {
                  required: "La categoria è obbligatoria",
                })}
                placeholder="laboratorio"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => removeCategory(index)}
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
              onClick={() => appendCategory({})}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Categoria
            </Button>
          </div>
        </div>

        <FormRow label="Codice:" error={errors.code?.text?.message}>
          <FormInput
            {...register("code.text", { required: "Il codice è obbligatorio" })}
            placeholder="segni vitali"
          />
        </FormRow>

        <FormRow
          label="Periodo di Validità Inizio:"
          error={errors.effectivePeriod?.start?.message}
        >
          <FormInput
            type="datetime-local"
            {...register("effectivePeriod.start", {
              required: "Il periodo di validità inizio è obbligatorio",
            })}
          />
        </FormRow>

        <FormRow
          label="Periodo di Validità Fine:"
          error={errors.effectivePeriod?.end?.message}
        >
          <FormInput
            type="datetime-local"
            {...register("effectivePeriod.end", {
              required: "Il periodo di validità fine è obbligatorio",
            })}
          />
        </FormRow>

        <FormRow label="Data di Emissione:" error={errors.issued?.message}>
          <FormInput
            type="datetime-local"
            {...register("issued", {
              required: "La data di emissione è obbligatoria",
            })}
          />
        </FormRow>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Interpretazione
          </h3>
          {interpretationFields.map((item, index) => (
            <div key={item.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`interpretation[${index}].text`, {
                  required: "L'interpretazione è obbligatoria",
                })}
                placeholder="descrizione"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => removeInterpretation(index)}
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
              onClick={() => appendInterpretation({})}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Interpretazione
            </Button>
          </div>
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">Note</h3>
          {noteFields.map((item, index) => (
            <div key={item.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`note[${index}].text`, {
                  required: "La nota è obbligatoria",
                })}
                placeholder="Nota"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => removeNote(index)}
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
              onClick={() => appendNote({})}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Nota
            </Button>
          </div>
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Componenti
          </h3>
          {componentFields.map((item, index) => (
            <div key={item.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`component[${index}].code.text`, {
                  required: `Il codice del componente ${index + 1} è obbligatorio`,
                })}
                placeholder="pressione sanguigna"
              />
              <FormInput
                type="number"
                {...register(`component[${index}].valueQuantity`, {
                  required: `Il valore del componente ${index + 1} è obbligatorio`,
                  valueAsNumber: true,
                })}
                placeholder="Valore"
              />
              <FormInput
                {...register(`component[${index}].unit`, {
                  required: `L'unità del componente ${index + 1} è obbligatoria`,
                })}
                placeholder="Unità"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => removeComponent(index)}
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
              onClick={() => appendComponent({})}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Componente
            </Button>
          </div>
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
              "Modifica risultato laboratorio"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLabResultForm;
