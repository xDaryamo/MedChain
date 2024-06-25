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
  const { data: labResult, isPending } = useQuery({
    queryKey: ["labResult", id],
    queryFn: () => getLabResult(id),
  });
  return { labResult, isPending };
};

export const useSearchLabResults = (query) => {
  const queryKey = query ? ["labResults", query] : ["labResults"];

  const { data: labResults, isPending } = useQuery({
    queryKey,
    queryFn: () => searchLabResults(query),
  });

  return { labResults, isPending };
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

export const useDeleteLabResult = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteResult, isPending } = useMutation({
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
  return { deleteResult, isPending };
};
