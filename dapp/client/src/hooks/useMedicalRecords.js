import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} from '../api';
import { setRecords, setRecord, setError, addRecord, updateRecord, removeRecord } from '../actions/medicalRecordsActions';

export const useMedicalRecords = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const { data: records, error: recordsError, isLoading: recordsLoading } = useQuery('medicalRecords', getMedicalRecords, {
        onSuccess: (data) => {
            dispatch(setRecords(data));
        },
        onError: (error) => {
            dispatch(setError(error.message));
        }
    });

    const useFetchRecord = (id) => {
        return useQuery(['medicalRecord', id], () => getMedicalRecord(id), {
            onSuccess: (data) => {
                dispatch(setRecord(data));
            },
            onError: (error) => {
                dispatch(setError(error.message));
            }
        });
    };

    const addRecordMutation = useMutation(createMedicalRecord, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('medicalRecords');
            dispatch(addRecord(data));
        },
        onError: (error) => {
            dispatch(setError(error.message));
        }
    });

    const modifyRecordMutation = useMutation(({ id, record }) => updateMedicalRecord(id, record), {
        onSuccess: (data) => {
            queryClient.invalidateQueries('medicalRecords');
            dispatch(updateRecord(data));
        },
        onError: (error) => {
            dispatch(setError(error.message));
        }
    });

    const removeRecordMutation = useMutation(deleteMedicalRecord, {
        onSuccess: (id) => {
            queryClient.invalidateQueries('medicalRecords');
            dispatch(removeRecord(id));
        },
        onError: (error) => {
            dispatch(setError(error.message));
        }
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
