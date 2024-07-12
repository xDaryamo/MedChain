import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import {
  useGetPractitioner,
  useUpdatePractitioner,
} from "../users/usePractitioner";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import { useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import BackButton from "../../ui/BackButton";

const EditPractitionerDetails = () => {
  const { user } = useUser();
  const { practitioner } = useGetPractitioner(user.userId);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const { updatePractitioner, isPending: updatePractitionerPending } =
    useUpdatePractitioner();

  useEffect(() => {
    if (practitioner) {
      setValue("firstName", practitioner.name?.[0]?.given?.join(" ") || "");
      setValue("lastName", practitioner.name?.[0]?.family || "");

      const birthDate = practitioner.date ? parseISO(practitioner.date) : "";
      if (isValid(birthDate)) {
        setValue("birthDate", format(birthDate, "yyyy-MM-dd"));
      } else {
        setValue("birthDate", "");
      }

      setValue("gender", practitioner.gender?.coding?.[0]?.code || "");
      setValue("prefix", practitioner.name?.[0]?.prefix?.[0] || "");
      setValue("suffix", practitioner.name?.[0]?.suffix?.[0] || "");
      setValue("phone", practitioner.telecom?.value || "");
      setValue("address", practitioner.address?.text || "");
      setValue("line", practitioner.address?.line || "");
      setValue("city", practitioner.address?.city || "");
      setValue("postalCode", practitioner.address?.postalcode || "");
      setValue("country", practitioner.address?.country || "");
      setValue(
        "qualificationCode",
        practitioner.qualification?.[0]?.code?.coding?.[0]?.code || "",
      );
      setValue(
        "qualificationStatus",
        practitioner.qualification?.[0]?.status?.coding?.[0]?.code || "",
      );
      setValue(
        "issuingOrganization",
        practitioner.qualification?.[0]?.issuer?.reference || "",
      );
    }
  }, [practitioner, setValue]);

  const onSubmit = (data) => {
    const names = data.firstName.split(" ");
    const formattedDate = data.birthDate
      ? format(
          new Date(`${data.birthDate}T00:00:00`),
          "yyyy-MM-dd'T'HH:mm:ssXXX",
        )
      : "";

    const finalData = {
      identifier: practitioner.identifier,
      active: true,
      name: [
        {
          text: `${data.firstName} ${data.lastName}`,
          family: data.lastName,
          given: names,
          prefix: [data.prefix],
          suffix: [data.suffix],
        },
      ],
      telecom: {
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
              system: "http://terminology.hl7.org/CodeSystem/contact-point-use",
              code: "work",
            },
          ],
        },
        rank: 1,
      },
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
      address: {
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
        postalcode: data.postalCode,
        country: data.country,
      },
      qualification: [
        {
          code: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
                code: data.qualificationCode,
                display: data.qualificationCode,
              },
            ],
            text: data.qualificationCode,
          },
          status: {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/credential-status",
                code: data.qualificationStatus,
                display: data.qualificationStatus,
              },
            ],
          },
          issuer: {
            reference: data.issuingOrganization,
            display:
              organizations.find(
                (org) => org.value === data.issuingOrganization,
              )?.label || data.issuingOrganization,
          },
        },
      ],
      communication: [
        {
          language: {
            coding: [
              {
                system: "urn:ietf:bcp:47",
                code: "it",
                display: "Italian",
              },
            ],
            text: "Italian",
            preferred: true,
          },
        },
      ],
    };

    console.log(finalData); // Debugging line to verify the finalData object

    updatePractitioner(
      { id: user.userId, practitioner: finalData },
      {
        onSuccess: () => navigate("/profile"),
      },
    );
  };

  const organizations = [
    {
      value: "ospedale-maresca.aslnapoli3.medchain.com",
      label: "Ospedale Maresca",
    },
    {
      value: "medicina-generale-napoli.medchain.com",
      label: "Medicina Generale Napoli",
    },
    { value: "farmacia-petrone.medchain.com", label: "Farmacia Petrone" },
    {
      value: "laboratorio-analisi-cmo.medchain.com",
      label: "Laboratorio Analisi CMO",
    },
  ];

  const qualificationCodes = [
    { value: "PN", label: "Advanced Practice Nurse" },
    { value: "AAS", label: "Associate of Applied Science" },
    { value: "AA", label: "Associate of Arts" },
    { value: "ABA", label: "Associate of Business Administration" },
    { value: "AE", label: "Associate of Engineering" },
    { value: "AS", label: "Associate of Science" },
    { value: "BA", label: "Bachelor of Arts" },
    { value: "BBA", label: "Bachelor of Business Administration" },
    { value: "BE", label: "Bachelor of Engineering" },
    { value: "BFA", label: "Bachelor of Fine Arts" },
    { value: "BN", label: "Bachelor of Nursing" },
    { value: "BS", label: "Bachelor of Science" },
    { value: "BSL", label: "Bachelor of Science - Law" },
    { value: "BSN", label: "Bachelor of Science - Nursing" },
    { value: "BT", label: "Bachelor of Theology" },
    { value: "CER", label: "Certificate" },
    { value: "CANP", label: "Certified Adult Nurse Practitioner" },
    { value: "CMA", label: "Certified Medical Assistant" },
    { value: "CNP", label: "Certified Nurse Practitioner" },
    { value: "CNM", label: "Certified Nurse Midwife" },
    { value: "CRN", label: "Certified Registered Nurse" },
    { value: "CNS", label: "Certified Nurse Specialist" },
    { value: "CPNP", label: "Certified Pediatric Nurse Practitioner" },
    { value: "CTR", label: "Certified Tumor Registrar" },
    { value: "DIP", label: "Diploma" },
    { value: "DBA", label: "Doctor of Business Administration" },
    { value: "DED", label: "Doctor of Education" },
    { value: "PharmD", label: "Doctor of Pharmacy" },
    { value: "PHE", label: "Doctor of Engineering" },
    { value: "PHD", label: "Doctor of Philosophy" },
    { value: "PHS", label: "Doctor of Science" },
    { value: "MD", label: "Doctor of Medicine" },
    { value: "DO", label: "Doctor of Osteopathy" },
    { value: "EMT", label: "Emergency Medical Technician" },
    { value: "EMTP", label: "Emergency Medical Technician - Paramedic" },
    { value: "FPNP", label: "Family Practice Nurse Practitioner" },
    { value: "HS", label: "High School Graduate" },
    { value: "JD", label: "Juris Doctor" },
    { value: "MA", label: "Master of Arts" },
    { value: "MBA", label: "Master of Business Administration" },
    { value: "MCE", label: "Master of Civil Engineering" },
    { value: "MDI", label: "Master of Divinity" },
    { value: "MED", label: "Master of Education" },
    { value: "MEE", label: "Master of Electrical Engineering" },
    { value: "ME", label: "Master of Engineering" },
    { value: "MFA", label: "Master of Fine Arts" },
    { value: "MME", label: "Master of Mechanical Engineering" },
    { value: "MS", label: "Master of Science" },
    { value: "MSL", label: "Master of Science - Law" },
    { value: "MSN", label: "Master of Science - Nursing" },
    { value: "MTH", label: "Master of Theology" },
    { value: "MDA", label: "Medical Assistant" },
    { value: "MT", label: "Medical Technician" },
    { value: "NG", label: "Non-Graduate" },
    { value: "NP", label: "Nurse Practitioner" },
    { value: "PA", label: "Physician Assistant" },
    { value: "RMA", label: "Registered Medical Assistant" },
    { value: "RN", label: "Registered Nurse" },
    { value: "RPH", label: "Registered Pharmacist" },
    { value: "SEC", label: "Secretarial Certificate" },
    { value: "TS", label: "Trade School Graduate" },
  ];

  const qualificationStatuses = [
    { value: "active", label: "Attivo" },
    { value: "inactive", label: "Inattivo" },
    { value: "in-progress", label: "In corso" },
    { value: "pending", label: "In attesa" },
    { value: "temporary", label: "Temporaneo" },
    { value: "conditional", label: "Condizionale" },
    { value: "suspended", label: "Sospeso" },
    { value: "revoked", label: "Revocato" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="mr-auto">
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg space-y-6"
      >
        <Heading>Modifica Dettagli Profilo</Heading>
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
        <FormRow label="Prefisso" error={errors?.prefix?.message}>
          <FormSelect
            id="prefix"
            {...register("prefix")}
            options={[
              { value: "Dr.", label: "Dr." },
              { value: "Prof.", label: "Prof." },
              { value: "Mr.", label: "Mr." },
              { value: "Mrs.", label: "Mrs." },
              { value: "Ms.", label: "Ms." },
            ]}
            defaultValue={getValues("prefix") || "Dr."}
          />
        </FormRow>
        <FormRow label="Suffisso" error={errors?.suffix?.message}>
          <FormSelect
            id="suffix"
            {...register("suffix")}
            options={[
              { value: "MD", label: "MD" },
              { value: "PhD", label: "PhD" },
              { value: "DO", label: "DO" },
            ]}
            defaultValue={getValues("suffix") || "MD"}
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
        <FormRow
          label="Codice Qualifica"
          error={errors?.qualificationCode?.message}
        >
          <FormSelect
            id="qualificationCode"
            {...register("qualificationCode", {
              required: "Il codice della qualifica è obbligatorio",
            })}
            options={qualificationCodes.map((code) => ({
              value: code.value,
              label: code.label,
            }))}
            defaultValue={
              getValues("qualificationCode") || qualificationCodes[0].value
            }
          />
        </FormRow>
        <FormRow
          label="Stato Qualifica"
          error={errors?.qualificationStatus?.message}
        >
          <FormSelect
            id="qualificationStatus"
            {...register("qualificationStatus", {
              required: "Lo stato della qualifica è obbligatorio",
            })}
            options={qualificationStatuses.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            defaultValue={
              getValues("qualificationStatus") || qualificationStatuses[0].value
            }
          />
        </FormRow>
        <FormRow
          label="Organizzazione"
          error={errors?.issuingOrganization?.message}
        >
          <FormSelect
            id="issuingOrganization"
            {...register("issuingOrganization", {
              required: "L'organizzazione emittente è obbligatoria",
            })}
            options={organizations.map((org) => ({
              value: org.value,
              label: org.label,
            }))}
            defaultValue={
              getValues("issuingOrganization") || organizations[0].value
            }
          />
        </FormRow>
        <div className="flex w-full justify-center space-x-4">
          <Button
            type="submit"
            size="large"
            variant="primary"
            disabled={updatePractitionerPending}
          >
            {updatePractitionerPending ? <Spinner /> : "Aggiorna"}
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

export default EditPractitionerDetails;
