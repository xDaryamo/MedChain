/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useAddRecord } from "./useMedicalRecords";
import AllergiesForm from "./AllergiesForm";
import ConditionsForm from "./ConditionsForm";
import ProceduresForm from "./ProceduresForm";
import MedicationRequestsForm from "./MedicationRequestsForm";
import LabResultsForm from "./LabResultsForm";
import Spinner from "../../ui/Spinner";
import { useParams } from "react-router-dom";

const AddMedicalRecordForm = ({ onSubmitSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { addRecord, isPending } = useAddRecord();

  const { id: patientID } = useParams();

  const onSubmit = (data) => {
    const labResultsIDs = data.labResultsIDs.map((lr) => lr.id);
    const record = {
      patientID,
      allergies: data.allergies,
      conditions: data.conditions,
      procedures: data.procedures,
      prescriptions: data.prescriptions,
      labResultsIDs,
      serviceRequest: data.serviceRequestReference
        ? {
            reference: data.serviceRequestReference,
            display: data.serviceRequestDisplay,
          }
        : null,
      attachments: data.attachments ? JSON.parse(data.attachments) : [],
    };

    addRecord(record, {
      onSettled: () => {
        reset();
        onSubmitSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-2xl font-bold">Add New Medical Record</h2>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Allergies</h3>
        <AllergiesForm control={control} register={register} />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Conditions</h3>
        <ConditionsForm control={control} register={register} />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Procedures</h3>
        <ProceduresForm control={control} register={register} />
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Medication Requests</h3>
        <MedicationRequestsForm control={control} register={register} />
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

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Service Request</h3>
        <FormRow
          label="Service Request Reference"
          error={errors.serviceRequestReference?.message}
        >
          <FormInput
            type="text"
            id="serviceRequestReference"
            {...register("serviceRequestReference")}
          />
        </FormRow>

        <FormRow
          label="Service Request Display"
          error={errors.serviceRequestDisplay?.message}
        >
          <FormInput
            type="text"
            id="serviceRequestDisplay"
            {...register("serviceRequestDisplay")}
          />
        </FormRow>
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold">Attachments</h3>
        <FormRow label="Attachments (JSON)" error={errors.attachments?.message}>
          <FormInput
            type="text"
            id="attachments"
            {...register("attachments")}
            placeholder='[{"url": "attachment1"}, {"url": "attachment2"}]'
          />
        </FormRow>
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
    </form>
  );
};

export default AddMedicalRecordForm;
