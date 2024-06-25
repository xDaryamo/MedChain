import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  createCondition,
  createProcedure,
  updateCondition,
  updateProcedure,
  searchMedicalRecords,
} from "../../services/apiRecords";
import toast from "react-hot-toast";

export const useSearchMedicalRecords = (query) => {
  const queryKey = query ? ["medicalRecords", query] : ["medicalRecords"];
  const { data: records, isLoading: isPending } = useQuery({
    queryKey,
    queryFn: () => searchMedicalRecords(query),
  });
  return {
    isPending,
    records,
  };
};

export const useGetMedicalRecord = (id) => {
  const { data: record, isLoading: isPending } = useQuery({
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
      const createdConditions = await Promise.all(
        (record.conditions || []).map((condition) =>
          createCondition(condition),
        ),
      );

      const createdProcedures = await Promise.all(
        (record.procedures || []).map((procedure) =>
          createProcedure(procedure),
        ),
      );

      const updatedRecord = {
        ...record,
        conditions: createdConditions.map((cond) => cond.id),
        procedures: createdProcedures.map((proc) => proc.id),
      };

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

  const { mutate: updateRecord, isLoading: isPending } = useMutation({
    mutationFn: async ({ id, record }) => {
      await Promise.all(
        record.Conditions.map((condition) =>
          updateCondition(condition.id, condition),
        ),
      );

      await Promise.all(
        record.Procedures.map((procedure) =>
          updateProcedure(procedure.id, procedure),
        ),
      );

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

  const { mutate: removeRecord, isLoading: isPending } = useMutation({
    mutationFn: deleteMedicalRecord,
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
