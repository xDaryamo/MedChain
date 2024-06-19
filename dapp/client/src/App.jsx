import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./ui/Layout";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import RecordHome from "./features/records/RecordHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="medical-records" element={<RecordHome />} />
          {/* <Route path="profile" element={<ProfilePage />} />

          <Route
            path="medical-records/:id"
            element={<MedicalRecordDetailPage />}
          /> */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
