import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMedicationRequest,
    createMedicationRequest,
    updateMedicationRequest,
    deleteMedicationRequest,
    searchMedicationRequests,
} from "../../services/apiMedicationRequests";
import toast from "react-hot-toast";

export const useSearchMedicationRequests = (query) => {
    const queryKey = query ? ["medicationRequests", query] : ["medicationRequests"];
    const { data: medicationRequests, isLoading: isPending } = useQuery({
        queryKey,
        queryFn: () => searchMedicationRequests(query),
    });
    return {
        isPending,
        medicationRequests,
    };
};

export const useGetMedicationRequest = (id) => {
    const { data: medicationRequest, isLoading: isPending } = useQuery({
        queryKey: ["medicationRequest", id],
        queryFn: () => getMedicationRequest(id),
    });
    return {
        isPending,
        medicationRequest,
    };
};

export const useAddMedicationRequest = () => {
    const queryClient = useQueryClient();

    const { mutate: addMedicationRequest, isLoading: isPending } = useMutation({
        mutationFn: createMedicationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicationRequests"] });
            toast.success("Medication request added successfully");
        },
        onError: (error) => {
            toast.error("Failed to add medication request");
            console.error("Add medication request error", error);
        },
    });

    return { addMedicationRequest, isPending };
};

export const useUpdateMedicationRequest = () => {
    const queryClient = useQueryClient();

    const { mutate: updateMedicationRequest, isLoading: isPending } = useMutation({
        mutationFn: async ({ id, medicationRequest }) => {
            await updateMedicationRequest(id, medicationRequest);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicationRequests"] });
            toast.success("Medication request updated successfully");
        },
        onError: (error) => {
            toast.error("Failed to update medication request");
            console.error("Update medication request error", error);
        },
    });

    return { updateMedicationRequest, isPending };
};

export const useRemoveMedicationRequest = () => {
    const queryClient = useQueryClient();

    const { mutate: removeMedicationRequest, isLoading: isPending } = useMutation({
        mutationFn: deleteMedicationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicationRequests"] });
            toast.success("Medication request deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete medication request");
            console.error("Delete medication request error", error);
        },
    });

    return { removeMedicationRequest, isPending };
};
