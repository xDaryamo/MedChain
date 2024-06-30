import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEncounter,
    createEncounter,
    updateEncounter,
    deleteEncounter,
    searchEncounters,
} from "../../services/apiEncounters";
import toast from "react-hot-toast";

export const useSearchEncounters = (query) => {
    const queryKey = query ? ["encounters", query] : ["encounters"];
    const { data: encounters, isLoading: isPending } = useQuery({
        queryKey,
        queryFn: () => searchEncounters(query),
    });
    return {
        isPending,
        encounters,
    };
};

export const useGetEncounter = (id) => {
    const { data: encounter, isLoading: isPending } = useQuery({
        queryKey: ["encounter", id],
        queryFn: () => getEncounter(id),
    });
    return {
        isPending,
        encounter,
    };
};

export const useAddEncounter = () => {
    const queryClient = useQueryClient();

    const { mutate: addEncounter, isLoading: isPending } = useMutation({
        mutationFn: createEncounter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["encounters"] });
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

    const { mutate: updateEncounter, isLoading: isPending } = useMutation({
        mutationFn: async ({ id, encounter }) => {
            await updateEncounter(id, encounter);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["encounters"] });
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

    const { mutate: removeEncounter, isLoading: isPending } = useMutation({
        mutationFn: deleteEncounter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["encounters"] });
            toast.success("Encounter deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete encounter");
            console.error("Delete encounter error", error);
        },
    });

    return { removeEncounter, isPending };
};
