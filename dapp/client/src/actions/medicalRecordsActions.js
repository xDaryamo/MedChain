// src/actions/medicalRecordsActions.js

export const setRecords = (records) => ({
    type: 'SET_RECORDS',
    payload: records,
});

export const setRecord = (record) => ({
    type: 'SET_RECORD',
    payload: record,
});

export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error,
});

export const addRecord = (record) => ({
    type: 'ADD_RECORD',
    payload: record,
});

export const updateRecord = (record) => ({
    type: 'UPDATE_RECORD',
    payload: record,
});

export const removeRecord = (id) => ({
    type: 'REMOVE_RECORD',
    payload: id,
});
