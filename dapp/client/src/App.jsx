import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Layout from "./ui/Layout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import RecordHome from "./features/records/RecordHome";
import Login from "./features/authentication/Login";
import Signup from "./features/authentication/Signup";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ui/ProtectedRoute";
import LabResultList from "./features/labresults/LabResultList";
import MedicalRecordList from "./features/records/MedicalRecordList";
import RecordPage from "./features/records/RecordPage";

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
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="medical-records" element={<RecordHome />} />

            <Route
              path="records"
              element={
                <ProtectedRoute>
                  <MedicalRecordList />
                </ProtectedRoute>
              }
            />
            <Route path="labresults" element={<LabResultList />} />

            <Route path="signup" element={<Signup />} />
            <Route path="records/:id" element={<RecordPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route path="login" element={<Login />} />
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
