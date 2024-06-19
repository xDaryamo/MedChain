import { configureStore } from '@reduxjs/toolkit';
import medicalRecordsReducer from './reducers/medicalRecordsReducer';

const store = configureStore({
    reducer: {
        medicalRecords: medicalRecordsReducer,
    },
});

export default store;
