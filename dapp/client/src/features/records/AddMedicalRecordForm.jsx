import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useAddRecord } from "./useMedicalRecords";
import AllergiesForm from "./AllergiesForm";
import ConditionsForm from "./ConditionsForm";
import ProceduresForm from "./ProceduresForm";
import MedicationRequestsForm from "./MedicationRequestsForm";
import Spinner from "../../ui/Spinner";

const AddMedicalRecordForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const { addRecord, isPending } = useAddRecord();

  const onSubmit = (data) => {
    const record = {
      patientID: data.patientID,
      allergies: data.allergies || [],
      conditions: data.conditions || [],
      procedures: data.procedures || [],
      prescriptions: data.prescriptions || [],
      serviceRequest: {
        reference: data.serviceRequestReference,
        display: data.serviceRequestDisplay,
      },
      attachments: data.attachments || [],
    };

    addRecord(record, {
      onSettled: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold">Add New Medical Record</h2>

      <FormRow label="Patient ID" error={errors.patientID?.message}>
        <FormInput
          type="text"
          id="patientID"
          {...register("patientID", { required: "Patient ID is required" })}
        />
      </FormRow>

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

      <Button type="submit" disabled={isPending}>
        {isPending ? <Spinner /> : "Add Record"}
      </Button>
    </form>
  );
};

export default AddMedicalRecordForm;
