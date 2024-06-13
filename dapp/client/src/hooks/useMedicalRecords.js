import { useState, useEffect } from "react";
import {
    getMedicalRecords,
    getMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
} from "../api";

export const useMedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await getMedicalRecords();
            setRecords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecord = async (id) => {
        setLoading(true);
        try {
            const data = await getMedicalRecord(id);
            setRecord(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addRecord = async (record) => {
        setLoading(true);
        try {
            await createMedicalRecord(record);
            fetchRecords();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const modifyRecord = async (id, record) => {
        setLoading(true);
        try {
            await updateMedicalRecord(id, record);
            fetchRecords();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeRecord = async (id) => {
        setLoading(true);
        try {
            await deleteMedicalRecord(id);
            fetchRecords();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        records,
        record,
        loading,
        error,
        fetchRecords,
        fetchRecord,
        addRecord,
        modifyRecord,
        removeRecord,
    };
};
