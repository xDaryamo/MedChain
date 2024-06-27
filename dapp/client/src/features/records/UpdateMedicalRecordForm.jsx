/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useUpdateRecord } from "./useMedicalRecords";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import AllergiesForm from "./AllergiesForm";
import ConditionsForm from "./ConditionsForm";
import ProceduresForm from "./ProceduresForm";
import MedicationRequestsForm from "./MedicationRequestsForm";

const UpdateMedicalRecordForm = ({ record, onUpdate, onCancel }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      patientID: record.patientID,
      allergies: record.allergies,
      conditions: record.conditions,
      procedures: record.procedures,
      prescriptions: record.prescriptions,
      serviceRequestReference: record.serviceRequest?.reference,
      serviceRequestDisplay: record.serviceRequest?.display,
      attachments: JSON.stringify(record.attachments),
    },
  });
  const { updateRecord, isPending: isUpdating } = useUpdateRecord();

  const onSubmit = async (data) => {
    const updatedRecord = {
      allergies: data.allergies || [],
      conditions: data.conditions || [],
      procedures: data.procedures || [],
      prescriptions: data.prescriptions || [],
      serviceRequest: {
        reference: data.serviceRequestReference,
        display: data.serviceRequestDisplay,
      },
      attachments: JSON.parse(data.attachments || "[]"),
    };

    try {
      updateRecord(record.id, updatedRecord);
      reset();
      onUpdate();
    } catch (err) {
      console.error("Error updating record:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold">Update Medical Record</h2>

      <AllergiesForm control={control} register={register} />
      <ConditionsForm control={control} register={register} />
      <ProceduresForm control={control} register={register} />
      <MedicationRequestsForm control={control} register={register} />

      <FormRow
        label="Service Request Reference"
        error={errors.serviceRequestReference?.message}
      >
        <FormInput
          type="text"
          id="serviceRequestReference"
          {...register("serviceRequestReference", {
            required: "Service Request Reference is required",
          })}
        />
      </FormRow>

      <FormRow
        label="Service Request Display"
        error={errors.serviceRequestDisplay?.message}
      >
        <FormInput
          type="text"
          id="serviceRequestDisplay"
          {...register("serviceRequestDisplay", {
            required: "Service Request Display is required",
          })}
        />
      </FormRow>

      <FormRow label="Attachments (JSON)" error={errors.attachments?.message}>
        <FormInput
          type="text"
          id="attachments"
          {...register("attachments")}
          placeholder='[{"url": "attachment1"}, {"url": "attachment2"}]'
        />
      </FormRow>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? <Spinner /> : "Update Record"}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UpdateMedicalRecordForm;
