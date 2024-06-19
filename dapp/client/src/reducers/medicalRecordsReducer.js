// src/reducers/medicalRecordsReducer.js

const initialState = {
    records: [],
    record: null,
    loading: false,
    error: null,
};

const medicalRecordsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_RECORDS':
            return {
                ...state,
                records: action.payload,
                loading: false,
                error: null,
            };
        case 'SET_RECORD':
            return {
                ...state,
                record: action.payload,
                loading: false,
                error: null,
            };
        case 'SET_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'ADD_RECORD':
            return {
                ...state,
                records: [...state.records, action.payload],
            };
        case 'UPDATE_RECORD':
            return {
                ...state,
                records: state.records.map(record =>
                    record.RecordID === action.payload.RecordID ? action.payload : record
                ),
            };
        case 'REMOVE_RECORD':
            return {
                ...state,
                records: state.records.filter(record => record.RecordID !== action.payload),
            };
        default:
            return state;
    }
};

export default medicalRecordsReducer;
