import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getObservation,
  createObservation,
  updateObservation as updateObservationApi,
  deleteObservation,
  searchObservations,
} from "../../services/apiObservations";
import toast from "react-hot-toast";

export const useSearchObservations = (query) => {
  const queryKey = query ? ["observations", query] : ["observations"];
  const { data: observations, isPending } = useQuery({
    queryKey,
    queryFn: () => searchObservations(query),
  });
  return {
    isPending,
    observations,
  };
};

export const useGetObservation = (id) => {
  const { data: observation, isPending } = useQuery({
    queryKey: ["observation", id],
    queryFn: () => getObservation(id),
    enabled: !!id,
  });
  return {
    isPending,
    observation,
  };
};

export const useAddObservation = () => {
  const queryClient = useQueryClient();

  const { mutate: addObservation, isPending } = useMutation({
    mutationFn: createObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
      toast.success("Observation added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add observation");
      console.error("Add observation error", error);
    },
  });

  return { addObservation, isPending };
};

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();

  const { mutate: updateObservation, isPending } = useMutation({
    mutationFn: async ({ id, observation }) => {
      updateObservationApi(id, observation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
      toast.success("Observation updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update observation");
      console.error("Update observation error", error);
    },
  });

  return { updateObservation, isPending };
};

export const useRemoveObservation = () => {
  const queryClient = useQueryClient();

  const { mutate: removeObservation, isPending } = useMutation({
    mutationFn: deleteObservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
      toast.success("Observation deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete observation");
      console.error("Delete observation error", error);
    },
  });

  return { removeObservation, isPending };
};
