import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLabResult,
  searchLabResults,
  createLabResult,
  updateLabResult,
} from "../../services/apiLabResults";
import toast from "react-hot-toast";

export const useGetLabResult = (id) => {
  const {
    data: labResult,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["labResult", id],
    queryFn: () => getLabResult(id),
    enabled: !!id,
  });
  return { labResult, isPending, refetch };
};

export const useGetLabResultsByIds = (ids) => {
  const {
    data: labResults,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["labResults", ids],
    queryFn: () => Promise.all(ids.map((id) => getLabResult(id))),
    enabled: ids.length > 0,
    onError: (error) => {
      toast.error("Failed to fetch lab results");
      console.error("Fetch lab results error", error);
    },
  });

  return { labResults: labResults || [], isPending, error, refetch };
};

export const useSearchLabResults = (query) => {
  const queryKey = query ? ["labResults", query] : ["labResults"];

  const {
    data: labResults,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => searchLabResults(query),
    onError: (error) => {
      toast.error("Failed to fetch lab results");
      console.error("Fetch lab results error", error);
    },
  });
  return { labResults: labResults || [], isPending, error, refetch };
};

export const useCreateLabResult = () => {
  const queryClient = useQueryClient();
  const { mutate: createResult, isPending } = useMutation({
    mutationFn: createLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries(["labResults"]);
      toast.success("Lab result created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create lab result");
      console.error("Create lab result error", error);
    },
  });
  return { createResult, isPending };
};

export const useUpdateLabResult = () => {
  const queryClient = useQueryClient();
  const { mutate: updateResult, isPending } = useMutation({
    mutationFn: ({ id, labResult }) => updateLabResult(id, labResult),
    onSuccess: () => {
      queryClient.invalidateQueries(["labResults"]);
      toast.success("Lab result updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update lab result");
      console.error("Update lab result error", error);
    },
  });
  return { updateResult, isPending };
};
