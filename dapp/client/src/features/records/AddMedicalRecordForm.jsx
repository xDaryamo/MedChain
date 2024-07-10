/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { useAddRecord } from "./useMedicalRecords";
import AllergiesForm from "./AllergiesForm";
import ConditionsForm from "./ConditionsForm";
import ProceduresForm from "./ProceduresForm";
import MedicationRequestsForm from "./MedicationRequestsForm";
import LabResultsForm from "./LabResultsForm";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import { useUser } from "../authentication/useAuth";
import { useGetPractitioner } from "../users/usePractitioner";

const AddMedicalRecordForm = ({ onSubmitSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { addRecord, isPending } = useAddRecord();
  const { id: patientID } = useParams();
  const { patient } = useGetPatient(patientID);
  const { user } = useUser();
  const { practitioner } = useGetPractitioner(user.userId);

  const onSubmit = async (data) => {
    try {
      const labResultsIDs = data.labResultsIDs?.map((lr) => lr.id) || [];
      const record = {
        patientID,

        allergies: data.allergies.map((allergy) => ({
          ...allergy,
          identifier: {
            system: "urn:ietf:rfc:3986",
          },
          patient: {
            reference: patientID,
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
            text: allergy.code.coding[0].display,
          },
          reaction: allergy.reaction.map((reaction) => ({
            ...reaction,
            substance: {
              ...reaction.substance,
              coding: reaction.substance.coding.map((coding) => ({
                ...coding,
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              })),
            },
          })),
        })),

        conditions: data.conditions.map((condition) => ({
          ...condition,
          identifier: {
            system: "urn:ietf:rfc:3986",
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
              text: condition.category[0].coding[0].text,
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
            text: condition.severity.coding[0].text,
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
              text: condition.code.coding[0].text,
            },
          ],
          subject: {
            reference: patientID,
            display: patient?.name?.text || "Unknown",
          },
          recordedDate: new Date().toISOString(),
          recorder: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
          asserter: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
        })),
        procedures: data.procedures.map((procedure) => ({
          ...procedure,
          subject: {
            reference: patientID,
            display: patient?.name?.text || "Unknown",
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
            text: "Completed",
          },
          performed: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
        })),
        prescriptions: (data.prescriptions || []).map((prescription) => ({
          ...prescription,
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
          subject: {
            reference: patientID,
            display: patient?.name?.text || "Unknown",
          },
          authoredOn: new Date().toISOString(),
          requester: {
            reference: practitioner.identifier.value,
            display: practitioner.name[0].text,
          },
        })),
        labResultsIDs,
      };

      addRecord(record, {
        onSettled: () => {
          reset();
          onSubmitSuccess();
        },
      });
    } catch (error) {
      console.error("Add medical record error", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold">Add New Medical Record</h2>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Allergies</h3>
        <AllergiesForm
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Conditions</h3>
        <ConditionsForm
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Procedures</h3>
        <ProceduresForm control={control} register={register} errors={errors} />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Medication Requests</h3>
        <MedicationRequestsForm
          control={control}
          register={register}
          errors={errors}
        />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Lab Results</h3>
        <LabResultsForm
          control={control}
          register={register}
          errors={errors}
          patientID={patientID} // Pass patientID to LabResultsForm
        />
      </div>

      <div className="flex w-full justify-center">
        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          size="large"
        >
          {isPending ? <Spinner /> : "Add Record"}
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
  );
};

export default AddMedicalRecordForm;
