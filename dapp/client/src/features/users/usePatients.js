import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatient,
  createPatient,
  updatePatient as updatePatientApi,
  deletePatient,
  searchPatients,
  requestAccess as requestAccessApi,
  grantAccess as grantAccessApi,
  revokeAccess as revokeAccessApi,
  getAccessRequests as getAccessRequestsApi,
  getPatientByEmail,
  deletePendingRequest as deletePendingRequestApi,
} from "../../services/apiPatients";
import toast from "react-hot-toast";

export const useSearchPatients = (query) => {
  const queryKey = query ? ["patients", query] : ["patients"];
  const { data: patients, isPending } = useQuery({
    queryKey,
    queryFn: () => searchPatients(query),
  });
  return {
    isPending,
    patients,
  };
};

export const useGetPatient = (id) => {
  const { data: patient, isPending } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id),
    enabled: !!id,
  });

  return {
    isPending,
    patient,
  };
};

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  const { mutate: addPatient, isPending } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add patient");
      console.error("Add patient error", error);
    },
  });

  return { addPatient, isPending };
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  const { mutate: updatePatient, isPending } = useMutation({
    mutationFn: ({ id, patient }) => updatePatientApi(id, patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update patient");
      console.error("Update patient error", error);
    },
  });

  return { updatePatient, isPending };
};

export const useRemovePatient = () => {
  const queryClient = useQueryClient();

  const { mutate: removePatient, isPending } = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete patient");
      console.error("Delete patient error", error);
    },
  });

  return { removePatient, isPending };
};

export const useRequestAccess = () => {
  const { mutate: requestAccess, isPending } = useMutation({
    mutationFn: ({ id, isOrg }) => requestAccessApi(id, { isOrg }),
    onSuccess: () => {
      toast.success("Access request sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send access request");
      console.error("Request access error", error);
    },
  });

  return { requestAccess, isPending };
};

export const useGrantAccess = () => {
  const queryClient = useQueryClient();

  const { mutate: grantAccess, isPending } = useMutation({
    mutationFn: (id) => grantAccessApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedPatients"] });
      toast.success("Access granted successfully");
    },
    onError: (error) => {
      toast.error("Failed to grant access");
      console.error("Grant access error", error);
    },
  });

  return { grantAccess, isPending };
};

export const useRevokeAccess = () => {
  const queryClient = useQueryClient();

  const { mutate: revokeAccess, isPending } = useMutation({
    mutationFn: (id) => revokeAccessApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedPatients"] });
      toast.success("Access revoked successfully");
    },
    onError: (error) => {
      toast.error("Failed to revoke access");
      console.error("Revoke access error", error);
    },
  });

  return { revokeAccess, isPending };
};

export const useDeletePendingRequest = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePendingRequest, isPending } = useMutation({
    mutationFn: (id) => deletePendingRequestApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      toast.success("Pending request deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pending request");
      console.error("Delete pending request error", error);
    },
  });

  return { deletePendingRequest, isPending };
};

export const useGetAccessRequests = () => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["accessRequests"],
    queryFn: () => getAccessRequestsApi(),
    refetchInterval: 5000,
  });

  const grantedRequests = data
    ? data.filter((request) => request.authorized === true)
    : [];
  const pendingRequests = data
    ? data.filter((request) => request.authorized === false)
    : [];

  return {
    isPending,
    error,
    grantedRequests,
    pendingRequests,
    refetch,
  };
};

export const useGetPatientByEmail = (email) => {
  const {
    data: patient,
    isPending,
    error,
  } = useQuery({
    queryKey: ["patientByEmail", email],
    queryFn: () => getPatientByEmail(email),
    enabled: !!email,
    onError: (error) => {
      toast.error("Failed to fetch patient by email");
      console.error("Get patient by email error", error);
    },
  });

  return {
    isPending,
    patient,
    error,
  };
};
