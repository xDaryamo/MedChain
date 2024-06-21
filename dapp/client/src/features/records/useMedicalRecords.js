import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} from "../../services/apiRecords";

export const useMedicalRecords = () => {
    const queryClient = useQueryClient();

    const { data: records, error: recordsError, isLoading: recordsLoading } = useQuery({
        queryKey: ["medicalRecords"],
        queryFn: getMedicalRecords,
    });

    const useFetchRecord = (id) => {
        return useQuery({
            queryKey: ["medicalRecord", id],
            queryFn: () => getMedicalRecord(id),
        });
    };

    const addRecordMutation = useMutation({
        mutationFn: createMedicalRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
        },
    });

    const modifyRecordMutation = useMutation({
        mutationFn: ({ id, record }) => updateMedicalRecord(id, record),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
        },
    });

    const removeRecordMutation = useMutation({
        mutationFn: deleteMedicalRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
        },
    });

    return {
        records,
        recordsLoading,
        recordsError,
        useFetchRecord,
        addRecordMutation,
        modifyRecordMutation,
        removeRecordMutation,
    };
};
