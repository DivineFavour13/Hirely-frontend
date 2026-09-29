import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { CompaniesPage } from "@/features/companies/CompaniesPage";
import { JobsPage } from "@/features/jobs/JobsPage";
import { ApplicantsPage } from "@/features/applicants/ApplicantsPage";
import { TrackingPage } from "@/features/tracking/TrackingPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardOverview />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/companies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CompaniesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/applicants"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ApplicantsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/tracking"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TrackingPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;