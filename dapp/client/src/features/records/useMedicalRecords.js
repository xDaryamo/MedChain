import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    createCondition,
    createProcedure,
    updateCondition,
    updateProcedure
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
        mutationFn: async (record) => {

            const createdConditions = await Promise.all(
                record.Conditions.map(condition => createCondition(condition))
            );

            const createdProcedures = await Promise.all(
                record.Procedures.map(procedure => createProcedure(procedure))
            );

            const updatedRecord = {
                ...record,
                Conditions: createdConditions.map(cond => cond.id),
                Procedures: createdProcedures.map(proc => proc.id),
            };

            createMedicalRecord(updatedRecord);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
        },
    });

    const modifyRecordMutation = useMutation({
        mutationFn: async ({ id, record }) => {

            await Promise.all(
                record.Conditions.map(condition => updateCondition(condition.id, condition))
            );

            await Promise.all(
                record.Procedures.map(procedure => updateProcedure(procedure.id, procedure))
            );

            updateMedicalRecord(id, record);
        },
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
