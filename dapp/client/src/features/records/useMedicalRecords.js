import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  createConditionsBatch,
  createProceduresBatch,
  createAllergiesBatch,
  updateConditionsBatch,
  updateProceduresBatch,
  updateAllergiesBatch,
  deleteConditionsBatch,
  deleteProceduresBatch,
  deleteAllergiesBatch,
  searchMedicalRecords,
} from "../../services/apiRecords";
import {
  createPrescriptionsBatch,
  updatePrescriptionsBatch,
  deletePrescriptionsBatch,
} from "../../services/apiPrescriptions";
import toast from "react-hot-toast";

export const useSearchMedicalRecords = (query) => {
  const queryKey = query ? ["medicalRecords", query] : ["medicalRecords"];
  const { data: records, isPending } = useQuery({
    queryKey,
    queryFn: () => searchMedicalRecords(query),
  });
  return {
    isPending,
    records,
  };
};

export const useGetMedicalRecord = (id) => {
  const { data: record, isPending } = useQuery({
    queryKey: ["medicalRecord", id],
    queryFn: () => getMedicalRecord(id),
  });
  return {
    isPending,
    record,
  };
};

export const useAddRecord = () => {
  const queryClient = useQueryClient();

  const { mutate: addRecord, isPending } = useMutation({
    mutationFn: async (record) => {
      console.log("Adding record:", record);

      const createdAllergies = await createAllergiesBatch(
        record.allergies || [],
      );
      console.log(record.allergies);
      const createdConditions = await createConditionsBatch(
        record.conditions || [],
      );
      const createdProcedures = await createProceduresBatch(
        record.procedures || [],
      );
      const createdPrescriptions = await createPrescriptionsBatch(
        record.prescriptions || [],
      );

      const updatedRecord = {
        ...record,
        allergies: createdAllergies.allergies,
        conditions: createdConditions.conditions,
        procedures: createdProcedures.procedures,
        prescriptions: createdPrescriptions.prescriptions,
        attachments: record.attachments || [],
      };

      console.log(updatedRecord);

      await createMedicalRecord(updatedRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
      toast.success("Medical record added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add medical record");
      console.error("Add medical record error", error);
    },
  });

  return { addRecord, isPending };
};

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();

  const { mutate: updateRecord, isPending } = useMutation({
    mutationFn: async ({ id, record }) => {
      await updateAllergiesBatch(record.allergies || []);
      await updateConditionsBatch(record.conditions || []);
      await updateProceduresBatch(record.procedures || []);
      await updatePrescriptionsBatch(record.prescriptions || []);

      await updateMedicalRecord(id, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
      toast.success("Medical record updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update medical record");
      console.error("Update medical record error", error);
    },
  });

  return { updateRecord, isPending };
};

export const useRemoveRecord = () => {
  const queryClient = useQueryClient();

  const { mutate: removeRecord, isPending } = useMutation({
    mutationFn: async (id) => {
      const record = await getMedicalRecord(id);
      await deleteAllergiesBatch(
        record.allergies.map((a) => a.identifier.value),
      );
      await deleteConditionsBatch(
        record.conditions.map((c) => c.identifier.value),
      );
      await deleteProceduresBatch(
        record.procedures.map((p) => p.identifier.value),
      );
      await deletePrescriptionsBatch(
        record.prescriptions.map((p) => p.identifier.value),
      );
      await deleteMedicalRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
      toast.success("Medical record deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete medical record");
      console.error("Delete medical record error", error);
    },
  });

  return { removeRecord, isPending };
};
