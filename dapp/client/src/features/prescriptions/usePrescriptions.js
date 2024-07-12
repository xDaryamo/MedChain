import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrescription,
  createPrescription,
  updatePrescription as updatePrescriptionApi,
  deletePrescription,
  searchPrescriptions,
  createPrescriptionsBatch as createPrescriptionsBatchApi,
  updatePrescriptionsBatch as updatePrescriptionsBatchApi,
  deletePrescriptionsBatch as deletePrescriptionsBatchApi,
} from "../../services/apiPrescriptions";
import toast from "react-hot-toast";

export const useGetPrescription = (id) => {
  const { data: prescription, isLoading: isPending } = useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescription(id),
  });
  return {
    isPending,
    prescription,
  };
};

export const useSearchPrescriptions = (query) => {
  const queryKey = query ? ["prescriptions", query] : ["prescriptions"];
  const { data: prescriptions, isLoading: isPending } = useQuery({
    queryKey,
    queryFn: () => searchPrescriptions(query),
  });
  return {
    isPending,
    prescriptions,
  };
};

export const useAddPrescription = () => {
  const queryClient = useQueryClient();

  const { mutate: addPrescription, isLoading: isPending } = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add prescription");
      console.error("Add prescription error", error);
    },
  });

  return { addPrescription, isPending };
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  const { mutate: updatePrescriptionMutation, isLoading: isPending } =
    useMutation({
      mutationFn: async ({ id, prescription }) => {
        await updatePrescriptionApi(id, prescription);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        toast.success("Prescription updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update prescription");
        console.error("Update prescription error", error);
      },
    });

  return { updatePrescription: updatePrescriptionMutation, isPending };
};

export const useRemovePrescription = () => {
  const queryClient = useQueryClient();

  const { mutate: removePrescription, isLoading: deletePending } = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete prescription");
      console.error("Delete prescription error", error);
    },
  });

  return { removePrescription, deletePending };
};

export const useAddPrescriptionsBatch = () => {
  const queryClient = useQueryClient();

  const { mutate: addPrescriptionsBatch, isLoading: isPending } = useMutation({
    mutationFn: createPrescriptionsBatchApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescriptions added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add prescriptions");
      console.error("Add prescriptions error", error);
    },
  });

  return { addPrescriptionsBatch, isPending };
};

export const useUpdatePrescriptionsBatch = () => {
  const queryClient = useQueryClient();

  const { mutate: updatePrescriptionsBatchMutation, isLoading: isPending } =
    useMutation({
      mutationFn: async (prescriptions) => {
        await updatePrescriptionsBatchApi(prescriptions);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        toast.success("Prescriptions updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update prescriptions");
        console.error("Update prescriptions error", error);
      },
    });

  return {
    updatePrescriptionsBatch: updatePrescriptionsBatchMutation,
    isPending,
  };
};

export const useRemovePrescriptionsBatch = () => {
  const queryClient = useQueryClient();

  const { mutate: removePrescriptionsBatchMutation, isLoading: isPending } =
    useMutation({
      mutationFn: async (ids) => {
        await deletePrescriptionsBatchApi(ids);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        toast.success("Prescriptions deleted successfully");
      },
      onError: (error) => {
        toast.error("Failed to delete prescriptions");
        console.error("Delete prescriptions error", error);
      },
    });

  return {
    removePrescriptionsBatch: removePrescriptionsBatchMutation,
    isPending,
  };
};
