import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLabResult,
  searchLabResults,
  createLabResult,
  updateLabResult,
  deleteLabResult,
} from "../../services/apiLabResults";
import toast from "react-hot-toast";

export const useGetLabResult = (id) => {
  return useQuery({
    queryKey: ["labResult", id],
    queryFn: () => getLabResult(id),
  });
};

export const useSearchLabResults = (query) => {
  const queryKey = query ? ["labResults", query] : ["labResults"];

  return useQuery({
    queryKey,
    queryFn: (query) => searchLabResults(query),
  });
};

export const useCreateLabResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
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
};

export const useUpdateLabResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
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
};

export const useDeleteLabResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries(["labResults"]);
      toast.success("Lab result deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete lab result");
      console.error("Delete lab result error", error);
    },
  });
};
