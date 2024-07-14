/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useGetPatientByEmail, useRequestAccess } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import SmallSpinner from "../../ui/SmallSpinner";

// Email validation regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddPatientModal = ({ isOpen, onClose, followedPatients }) => {
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const {
    patient,
    isPending: isPatientPending,
    error: patientError,
  } = useGetPatientByEmail(debouncedEmail);

  const { requestAccess, isPending: isRequestPending } = useRequestAccess();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (emailPattern.test(email)) {
        setDebouncedEmail(email);
      } else {
        setDebouncedEmail("");
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [email]);

  const handleRequestAccess = () => {
    if (patient) {
      requestAccess({ id: patient.userId, isOrg: "false" });
    }
  };

  const isPatientFollowed =
    patient && followedPatients.some((p) => p.userId === patient.userId);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-bold text-cyan-950">
          Aggiungi Paziente{" "}
        </h2>
        <FormInput
          label="Patient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter patient email"
        />

        {isPatientPending && debouncedEmail && <Spinner />}

        {patientError && debouncedEmail && (
          <p className="text-red-500">Error fetching patient data</p>
        )}

        {patient && (
          <div className="mt-4 rounded-lg border p-4">
            <h3 className="text-xl font-bold">{patient.username}</h3>
            <p>
              <span className="font-bold">Email:</span> {patient.email}
            </p>
            <p>
              <span className="font-bold">Identifier:</span> {patient.userId}
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleRequestAccess}
                variant="secondary"
                size="large"
                disabled={isPatientFollowed || isRequestPending}
              >
                {isPatientFollowed ? (
                  "Paziente già inserito"
                ) : isRequestPending ? (
                  <SmallSpinner />
                ) : (
                  "Richiedi accesso"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddPatientModal;
