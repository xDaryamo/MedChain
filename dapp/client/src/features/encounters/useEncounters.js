import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEncounter,
  createEncounter,
  updateEncounter as updateEncounterApi,
  deleteEncounter,
  searchEncounters,
} from "../../services/apiEncounters";
import toast from "react-hot-toast";

export const useGetEncounter = (id) => {
  const {
    data: encounter,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["encounter", id],
    queryFn: () => getEncounter(id),
    enabled: !!id,
    onError: (error) => {
      toast.error("Failed to fetch encounter");
      console.error("Fetch encounter error", error);
    },
  });
  return { encounter, isPending, refetch, error };
};

export const useSearchEncounters = (query) => {
  const queryKey = query ? ["encounters", query] : ["encounters"];
  const {
    data: encounters = [],
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => searchEncounters(query),
    onError: (error) => {
      toast.error("Failed to fetch encounters");
      console.error("Fetch encounters error", error);
    },
  });

  return {
    isPending,
    encounters,
    error,
    refetch,
  };
};

export const useAddEncounter = () => {
  const queryClient = useQueryClient();

  const { mutate: addEncounter, isPending } = useMutation({
    mutationFn: createEncounter,
    onSuccess: () => {
      queryClient.invalidateQueries(["encounters"]);
      toast.success("Encounter added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add encounter");
      console.error("Add encounter error", error);
    },
  });

  return { addEncounter, isPending };
};

export const useUpdateEncounter = () => {
  const queryClient = useQueryClient();

  const { mutate: updateEncounter, isPending } = useMutation({
    mutationFn: ({ id, encounter }) => updateEncounterApi(id, encounter),
    onSuccess: () => {
      queryClient.invalidateQueries(["encounters"]);
      toast.success("Encounter updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update encounter");
      console.error("Update encounter error", error);
    },
  });

  return { updateEncounter, isPending };
};

export const useRemoveEncounter = () => {
  const queryClient = useQueryClient();

  const { mutate: removeEncounter, isPending } = useMutation({
    mutationFn: deleteEncounter,
    onSuccess: () => {
      queryClient.invalidateQueries(["encounters"]);
      toast.success("Encounter deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete encounter");
      console.error("Delete encounter error", error);
    },
  });

  return { removeEncounter, isPending };
};
