// src/hooks/useMedicalRecords.js
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} from "../apiRecords";

export const useMedicalRecords = () => {
    const queryClient = useQueryClient();

    const { data: records, error: recordsError, isLoading: recordsLoading } = useQuery("medicalRecords", getMedicalRecords);

    const useFetchRecord = (id) => {
        return useQuery(["medicalRecord", id], () => getMedicalRecord(id));
    };

    const addRecordMutation = useMutation(createMedicalRecord, {
        onSuccess: () => {
            queryClient.invalidateQueries("medicalRecords");
        },
    });

    const modifyRecordMutation = useMutation(({ id, record }) => updateMedicalRecord(id, record), {
        onSuccess: () => {
            queryClient.invalidateQueries("medicalRecords");
        },
    });

    const removeRecordMutation = useMutation(deleteMedicalRecord, {
        onSuccess: () => {
            queryClient.invalidateQueries("medicalRecords");
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
