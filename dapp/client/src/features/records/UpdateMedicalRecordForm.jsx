/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "../../ui/Button";
import { useUpdateRecord, useGetMedicalRecord } from "./useMedicalRecords";
import AllergiesForm from "./AllergiesForm";
import ConditionsForm from "./ConditionsForm";
import ProceduresForm from "./ProceduresForm";
import MedicationRequestsForm from "./MedicationRequestsForm";
import LabResultsForm from "./LabResultsForm";
import Spinner from "../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import { useUser } from "../authentication/useAuth";
import { useGetPractitioner } from "../users/usePractitioner";
import BackButton from "../../ui/BackButton";
import Heading from "../../ui/Heading";

const UpdateMedicalRecordForm = () => {
  const { id } = useParams();
  const {
    record,
    isPending: recordLoading,
    error: recordError,
    refetch: refetchRecord,
  } = useGetMedicalRecord(id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  const { updateRecord, isPending: updatePending } = useUpdateRecord(id);
  const { patient } = useGetPatient(record?.patientID);
  const { user } = useUser();
  const { practitioner } = useGetPractitioner(user.userId);

  const navigate = useNavigate();

  useEffect(() => {
    if (record) {
      reset(record);
    }
  }, [record, reset]);

  const onSubmit = async (data) => {
    if (!record) {
      console.error("Record is undefined");
      return;
    }

    try {
      const labResultsIDs = data.labResultsIDs?.map((lr) => lr.id) || [];
      const updatedRecord = {
        ...data,
        patientID: record.patientID,
        allergies: (data.allergies || []).map((allergy) => ({
          ...allergy,
          identifier: {
            system: "urn:ietf:rfc:3986",
            value: allergy.identifier?.value || "",
          },
          patient: {
            reference: record.patientID,
            display: patient?.name?.text || "Unknown",
          },
          clinicalStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/allergy-clinical-status",
                code: "active",
                display: "Active",
              },
            ],
          },
          verificationStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/allergy-verification-status",
                code: "confirmed",
                display: "Confirmed",
              },
            ],
            text: "Confirmed",
          },
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: allergy.code.coding[0].code,
                display: allergy.code.coding[0].display,
              },
            ],
            text: allergy.code.text,
          },
          reaction: (allergy.reaction || []).map((reaction) => ({
            ...reaction,
            substance: {
              ...reaction.substance,
              coding: (reaction.substance.coding || []).map((coding) => ({
                ...coding,
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              })),
            },
          })),
        })),
        conditions: (data.conditions || []).map((condition) => ({
          ...condition,
          identifier: {
            system: "urn:ietf:rfc:3986",
            value: condition.identifier?.value || "",
          },
          clinicalStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
                display: "Active",
              },
            ],
            text: "Active",
          },
          verificationStatus: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                code: "confirmed",
                display: "Confirmed",
              },
            ],
            text: "Confirmed",
          },
          category: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/condition-category",
                  code: condition.category[0].coding[0].code,
                  display: condition.category[0].coding[0].display,
                },
              ],
              text: condition.category[0].text,
            },
          ],
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: condition.severity.coding[0].code,
                display: condition.severity.coding[0].display,
              },
            ],
            text: condition.severity.text,
          },
          code: [
            {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: condition.code.coding[0].code,
                  display: condition.code.coding[0].display,
                },
              ],
              text: condition.code.text,
            },
          ],
          subject: {
            reference: record.patientID,
            display: patient?.name?.text || "Unknown",
          },
          recordedDate: condition.recordedDate || new Date().toISOString(),
          recorder: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
          asserter: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
        })),
        procedures: (data.procedures || []).map((procedure) => ({
          ...procedure,
          identifier: {
            system: "urn:ietf:rfc:3986",
            value: procedure.identifier?.value || "",
          },
          subject: {
            reference: record.patientID,
            display: patient?.name?.text || "Unknown",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: procedure.code.coding[0].code,
                display: procedure.code.coding[0].display,
              },
            ],
            text: procedure.code.text,
          },
          status: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/procedure-status",
                code: "completed",
                display: "Completed",
              },
            ],
          },
          category: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: procedure.category.coding[0].code,
                display: procedure.category.coding[0].display,
              },
            ],
            text: procedure.category.text,
          },
          performed: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
          encounter: {
            reference: procedure.encounter.reference,
            display: procedure.encounter.display,
          },
          note: [
            {
              authorReference: {
                reference: practitioner.identifier.value,
                display: practitioner.name[0].text,
              },
              time: new Date().toISOString(),
              text: procedure.note[0].text,
            },
          ],
        })),
        prescriptions: (data.prescriptions || []).map((prescription) => {
          const start = prescription.dispenseRequest.validityPeriod.start
            ? new Date(
              prescription.dispenseRequest.validityPeriod.start,
            ).toISOString()
            : "";
          const end = prescription.dispenseRequest.validityPeriod.end
            ? new Date(
              prescription.dispenseRequest.validityPeriod.end,
            ).toISOString()
            : "";

          return {
            ...prescription,
            identifier: {
              system: "urn:ietf:rfc:3986",
              value: prescription.identifier?.value || "",
            },
            status: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/medication-request-status",
                  code: "active",
                  display: "Active",
                },
              ],
              text: "Active",
            },
            intent: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/medication-request-intent",
                  code: "order",
                  display: "Order",
                },
              ],
              text: "Order",
            },
            medicationCodeableConcept: {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: prescription.medicationCodeableConcept.coding[0].code,
                  display:
                    prescription.medicationCodeableConcept.coding[0].display,
                },
              ],
              text: prescription.medicationCodeableConcept.text,
            },
            subject: {
              reference: record.patientID,
              display: patient?.name?.text || "Unknown",
            },
            authoredOn: prescription.authoredOn || new Date().toISOString(),
            requester: {
              reference: practitioner.identifier.value,
              display: practitioner.name[0].text,
            },
            dispenseRequest: {
              quantity: {
                value: prescription.dispenseRequest.quantity.value,
                unit: prescription.dispenseRequest.quantity.unit,
                system: "http://unitsofmeasure.org",
              },
              expectedSupplyDuration: {
                value:
                  prescription.dispenseRequest.expectedSupplyDuration.value,
                unit: prescription.dispenseRequest.expectedSupplyDuration.unit,
                system: "http://unitsofmeasure.org",
              },
              validityPeriod: {
                start,
                end,
              },
              numberOfRepeatsAllowed:
                prescription.dispenseRequest.numberOfRepeatsAllowed,
            },
          };
        }),
        labResultsIDs,
      };

      updateRecord(
        { id, record: updatedRecord },
        {
          onSettled: async () => {
            await refetchRecord(); // Rifai il fetch dei dati aggiornati
            reset(updatedRecord); // Resetta il form con i nuovi valori
          },
        },
      );
    } catch (error) {
      console.error("Update medical record error", error);
    }
  };

  if (recordLoading) return <Spinner />;
  if (recordError) return <p>Error loading medical record</p>;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Heading>Modifica Cartella Clinica</Heading>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">Allergie</h3>
          <AllergiesForm
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
          />
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Condizioni
          </h3>
          <ConditionsForm
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
          />
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Procedure
          </h3>
          <ProceduresForm
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            patientID={record.patientID}
          />
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Prescrizioni
          </h3>
          <MedicationRequestsForm
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">
            Lab Results
          </h3>
          <LabResultsForm
            control={control}
            register={register}
            errors={errors}
            patientID={record.patientID}
            isUpdate={true}
          />
        </div>

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

        {errors && (
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

export default UpdateMedicalRecordForm;
