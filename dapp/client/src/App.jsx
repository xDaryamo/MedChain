import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Layout from "./ui/Layout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import Login from "./features/authentication/Login";
import Signup from "./features/authentication/Signup";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ui/ProtectedRoute";
import LabResultList from "./features/labresults/LabResultList";
import LabResultPage from "./features/labresults/LabResultPage";
import UpdateLabResultForm from "./features/labresults/UpdateLabResultForm";
import EncounterList from "./features/encounters/EncounterList";
import EncounterPage from "./features/encounters/EncounterPage";
import MedicationRequestList from "./features/prescriptions/MedicationRequestList";
import MedicationRequestPage from "./features/prescriptions/MedicationRequestPage";
import UpdateMedicationRequestForm from "./features/prescriptions/UpdateMedicationRequestForm";
import MedicalRecordList from "./features/records/MedicalRecordList";
import FollowedPatientsList from "./features/users/FollowedPatientsList";
import FollowedPatientPage from "./features/users/FollowedPatientPage";
import MedicalRecordDetails from "./features/records/MedicalRecordDetails";
import UpdateMedicalRecordForm from "./features/records/UpdateMedicalRecordForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="signup" element={<Signup />} />

            <Route
              path="patients"
              element={
                <ProtectedRoute>
                  <FollowedPatientsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="patients/:id"
              element={
                <ProtectedRoute>
                  <FollowedPatientPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="patients/:id/records"
              element={
                <ProtectedRoute>
                  <MedicalRecordList />
                </ProtectedRoute>
              }
            />

            <Route
              path="records/:id"
              element={
                <ProtectedRoute>
                  <MedicalRecordDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="patients/:id/labresults"
              element={
                <ProtectedRoute>
                  <LabResultList />
                </ProtectedRoute>
              }
            />

            <Route
              path="labresults/:id"
              element={
                <ProtectedRoute>
                  <LabResultPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="labresults/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateLabResultForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="patients/:id/prescriptions"
              element={
                <ProtectedRoute>
                  <MedicationRequestList />
                </ProtectedRoute>
              }
            />

            <Route
              path="prescriptions/:id"
              element={
                <ProtectedRoute>
                  <MedicationRequestPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="prescriptions/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateMedicationRequestForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="patients/:id/encounters"
              element={
                <ProtectedRoute>
                  <EncounterList />
                </ProtectedRoute>
              }
            />

            <Route
              path="encounters/:id"
              element={
                <ProtectedRoute>
                  <EncounterPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="records/:id"
              element={
                <ProtectedRoute>
                  <MedicalRecordDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="records/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateMedicalRecordForm />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#fff",
            color: "#374151",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
