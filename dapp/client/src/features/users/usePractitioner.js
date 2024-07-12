import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPractitioner,
  createPractitioner,
  updatePractitioner as updatePractitionerApi,
  deletePractitioner,
  getFollowedPatients,
} from "../../services/apiPractitioner";
import toast from "react-hot-toast";

export const useGetPractitioner = (id) => {
  const { data: practitioner, isPending } = useQuery({
    queryKey: ["practitioner", id],
    queryFn: () => getPractitioner(id),
    enabled: !!id,
  });

  return {
    isPending,
    practitioner,
  };
};

export const useAddPractitioner = () => {
  const queryClient = useQueryClient();

  const { mutate: addPractitioner, isPending } = useMutation({
    mutationFn: createPractitioner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioners"] });
      toast.success("Practitioner added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add practitioner");
      console.error("Add practitioner error", error);
    },
  });

  return { addPractitioner, isPending };
};

export const useUpdatePractitioner = () => {
  const queryClient = useQueryClient();

  const { mutate: updatePractitioner, isPending } = useMutation({
    mutationFn: ({ id, practitioner }) =>
      updatePractitionerApi(id, practitioner),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioners"] });
      toast.success("Practitioner updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update practitioner");
      console.error("Update practitioner error", error);
    },
  });

  return { updatePractitioner, isPending };
};

export const useRemovePractitioner = () => {
  const queryClient = useQueryClient();

  const { mutate: removePractitioner, isPending } = useMutation({
    mutationFn: deletePractitioner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioners"] });
      toast.success("Practitioner deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete practitioner");
      console.error("Delete practitioner error", error);
    },
  });

  return { removePractitioner, isPending };
};

export const useGetFollowedPatients = () => {
  const { data: followedPatients, isPending } = useQuery({
    queryKey: ["followedPatients"],
    queryFn: getFollowedPatients,
  });

  return {
    isPending,
    followedPatients,
  };
};
