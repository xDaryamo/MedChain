import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import { useGetPatient, useUpdatePatient } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import { format, parseISO, isValid } from "date-fns";
import BackButton from "../../ui/BackButton";

const EditPatientDetails = () => {
  const { user } = useUser();
  const { patient } = useGetPatient(user.userId);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  console.log(patient);
  const { updatePatient, isPending: updatePatientPending } = useUpdatePatient();

  useEffect(() => {
    if (patient) {
      setValue("firstName", patient.name?.given?.join(" ") || "");
      setValue("lastName", patient.name?.family || "");

      const birthDate = patient.date ? parseISO(patient.date) : "";
      if (isValid(birthDate)) {
        setValue("birthDate", format(birthDate, "yyyy-MM-dd"));
      } else {
        setValue("birthDate", "");
      }

      setValue("gender", patient.gender?.coding?.[0]?.code || "");
      setValue("phone", patient.telecom?.[0]?.value || "");
      setValue("address", patient.address?.[0]?.text || "");
      setValue("line", patient.address?.[0]?.line || "");
      setValue("city", patient.address?.[0]?.city || "");
      setValue("postalCode", patient.address?.[0]?.postalcode || "");
      setValue("country", patient.address?.[0]?.country || "");
      setValue("maritalStatus", patient.maritalstatus?.text || "");
    }
  }, [patient, setValue]);

  const onSubmit = (data) => {
    const names = data.firstName.split(" ");
    const formattedDate = data.birthDate
      ? format(
          new Date(`${data.birthDate}T00:00:00`),
          "yyyy-MM-dd'T'HH:mm:ssXXX",
        )
      : undefined;

    const finalData = {
      identifier: patient.identifier,
      active: true,
      name: {
        text: `${data.firstName} ${data.lastName}`,
        family: data.lastName,
        given: names,
      },
      telecom: [
        {
          system: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/contact-point-system",
                code: "phone",
              },
            ],
          },
          value: data.phone,
          use: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/contact-point-use",
                code: "home",
              },
            ],
          },
          rank: 1,
        },
      ],
      gender: {
        coding: [
          {
            system: "http://hl7.org/fhir/administrative-gender",
            code: data.gender,
            display:
              data.gender === "male"
                ? "Maschio"
                : data.gender === "female"
                  ? "Femmina"
                  : data.gender === "non-binary"
                    ? "Non-binario"
                    : "Altro",
          },
        ],
      },
      date: formattedDate,
      deceased: false,
      address: [
        {
          use: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/address-use",
                code: "home",
              },
            ],
          },
          type: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/address-type",
                code: "physical",
              },
            ],
          },
          text: data.address,
          line: data.line,
          city: data.city,
          state: data.state,
          postalcode: data.postalCode,
          country: data.country,
        },
      ],
      maritalstatus: {
        text: data.maritalStatus,
      },
      communication: [
        {
          language: {
            coding: [
              {
                display: "Italian",
              },
            ],
          },
        },
      ],
    };

    updatePatient(
      { id: user.userId, patient: finalData },
      {
        onSuccess: () => navigate("/profile"),
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="mr-auto">
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-6"
      >
        <Heading>Modifica Dettagli Paziente</Heading>
        <FormRow label="Nome" error={errors?.firstName?.message}>
          <FormInput
            type="text"
            id="firstName"
            {...register("firstName", { required: "Il nome è obbligatorio" })}
          />
        </FormRow>
        <FormRow label="Cognome" error={errors?.lastName?.message}>
          <FormInput
            type="text"
            id="lastName"
            {...register("lastName", { required: "Il cognome è obbligatorio" })}
          />
        </FormRow>
        <FormRow label="Data di Nascita" error={errors?.birthDate?.message}>
          <FormInput type="date" id="birthDate" {...register("birthDate")} />
        </FormRow>
        <FormRow label="Genere" error={errors?.gender?.message}>
          <FormSelect
            id="gender"
            {...register("gender", { required: "Il genere è obbligatorio" })}
            options={[
              { value: "male", label: "Maschio" },
              { value: "female", label: "Femmina" },
              { value: "non-binary", label: "Non-binario" },
              { value: "other", label: "Altro" },
            ]}
            defaultValue={getValues("gender") || "male"}
          />
        </FormRow>
        <FormRow label="Telefono" error={errors?.phone?.message}>
          <FormInput
            type="tel"
            id="phone"
            {...register("phone", { required: "Il telefono è obbligatorio" })}
          />
        </FormRow>
        <FormRow label="Indirizzo" error={errors?.address?.message}>
          <FormInput
            type="text"
            id="address"
            {...register("address", { required: "L'indirizzo è obbligatorio" })}
          />
        </FormRow>
        <FormRow label="Numero Civico" error={errors?.line?.message}>
          <FormInput
            type="number"
            id="line"
            {...register("line", {
              required: "Il numero civico è obbligatorio",
            })}
          />
        </FormRow>
        <FormRow label="Città" error={errors?.city?.message}>
          <FormInput
            type="text"
            id="city"
            {...register("city", { required: "La città è obbligatoria" })}
          />
        </FormRow>
        <FormRow label="Codice Postale" error={errors?.postalCode?.message}>
          <FormInput
            type="text"
            id="postalCode"
            {...register("postalCode", {
              required: "Il codice postale è obbligatorio",
            })}
          />
        </FormRow>
        <FormRow label="Paese" error={errors?.country?.message}>
          <FormInput
            type="text"
            id="country"
            {...register("country", { required: "Il paese è obbligatorio" })}
          />
        </FormRow>
        <FormRow label="Stato Civile" error={errors?.maritalStatus?.message}>
          <FormInput
            type="text"
            id="maritalStatus"
            {...register("maritalStatus")}
          />
        </FormRow>
        <div className="flex w-full justify-center space-x-4">
          <Button
            type="submit"
            size="large"
            variant="primary"
            disabled={updatePatientPending}
          >
            {updatePatientPending ? <Spinner /> : "Aggiorna"}
          </Button>
        </div>
        {errors && (
          <div className="mt-4 text-red-500">
            {Object.keys(errors).map((errorKey) => (
              <div key={errorKey}>
                {errors[errorKey]?.message ||
                  `C'è un errore nel campo ${errorKey}`}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditPatientDetails;
