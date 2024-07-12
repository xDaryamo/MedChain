import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormRow from "./FormRow";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ProgressBar from "./ProgressBar";
import { useSignup } from "../features/authentication/useAuth";
import Button from "./Button";
import NavigationButtons from "./NavigationButtons";
import SmallSpinner from "./SmallSpinner";

const PractitionerSignupForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Lista statica delle organizzazioni
  const organizations = [
    {
      value: "ospedale-maresca.aslnapoli3.medchain.com",
      label: "Ospedale Maresca",
    },
    { value: "farmacia-petrone.medchain.com", label: "Farmacia Petrone" },
    {
      value: "laboratorio-analisi-cmo.medchain.com",
      label: "Laboratorio Analisi CMO",
    },
  ];

  const qualifications = [
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

  const { signup, isPending } = useSignup();

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    const names = data.firstName.split(" ");
    const organizationLabel = organizations.find(
      (org) => org.value === data.organization,
    )?.label;

    const finalData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: "practitioner",
      organization: data.organization,
      fhirData: {
        identifier: {
          system: "http://hospital.smarthealthit.org",
          value: ``,
        },
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
                system:
                  "http://terminology.hl7.org/CodeSystem/contact-point-use",
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
        date: `${data.birthDate}T00:00:00Z`, // Correctly formatted date
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
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
        qualification: [
          {
            code: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
                  code: data.qualificationCode,
                  display:
                    qualifications.find(
                      (qual) => qual.value === data.qualificationCode,
                    )?.label || data.qualificationCode,
                },
              ],
              text:
                qualifications.find(
                  (qual) => qual.value === data.qualificationCode,
                )?.label || data.qualificationCode,
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
              reference: data.organization,
              display: organizationLabel,
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
      },
    };

    console.log("Final Form Data:", finalData);
    signup(finalData, {
      onSettled: () => {
        reset();
        setStep(1);
        navigate("/profile");
      },
    });
  };

  const steps = [
    "Credenziali di Accesso",
    "Informazioni Personali",
    "Dettagli di Contatto",
    "Qualifiche",
  ];

  return (
    <div>
      <ProgressBar currentStep={step} steps={steps} />
      <form
        onSubmit={handleSubmit(step === 4 ? onSubmit : handleNextStep)}
        className="gap-4 space-y-4 md:grid"
      >
        {step === 1 && (
          <>
            <NavigationButtons
              step={step}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleSubmit(handleNextStep)}
              isFinalStep={false}
            />
            <h2 className="col-span-2 mb-4 text-xl font-bold text-cyan-950">
              {steps[0]}
            </h2>
            <FormRow
              label="Nome utente"
              error={errors?.username?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="username"
                {...register("username", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Email"
              error={errors?.email?.message}
              className="col-span-1"
            >
              <FormInput
                type="email"
                id="email"
                {...register("email", {
                  required: "Questo campo è obbligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Per favore, inserisci un indirizzo email valido",
                  },
                })}
              />
            </FormRow>
            <FormRow
              label="Password"
              error={errors?.password?.message}
              className="col-span-1"
            >
              <FormInput
                type="password"
                id="password"
                {...register("password", {
                  required: "Questo campo è obbligatorio",
                  minLength: {
                    value: 8,
                    message: "La password deve essere di almeno 8 caratteri",
                  },
                })}
              />
            </FormRow>
            <FormRow
              label="Conferma Password"
              error={errors?.confirmPassword?.message}
              className="col-span-1"
            >
              <FormInput
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "Questo campo è obbligatorio",
                  validate: (value) =>
                    value === getValues().password ||
                    "Le password non corrispondono",
                })}
              />
            </FormRow>
          </>
        )}
        {step === 2 && (
          <>
            <NavigationButtons
              step={step}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleSubmit(handleNextStep)}
              isFinalStep={false}
            />
            <h2 className="col-span-2 mb-4 text-xl font-bold text-cyan-950">
              {steps[1]}
            </h2>
            <FormRow
              label="Nome"
              error={errors?.firstName?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Cognome"
              error={errors?.lastName?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Data di Nascita"
              error={errors?.birthDate?.message}
              className="col-span-1"
            >
              <FormInput
                type="date"
                id="birthDate"
                {...register("birthDate", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Genere"
              error={errors?.gender?.message}
              className="col-span-1"
            >
              <FormSelect
                id="gender"
                {...register("gender", {
                  required: "Questo campo è obbligatorio",
                })}
                options={[
                  { value: "male", label: "Maschio" },
                  { value: "female", label: "Femmina" },
                  { value: "non-binary", label: "Non-binario" },
                  { value: "other", label: "Altro" },
                ]}
              />
            </FormRow>
            <FormRow
              label="Prefisso"
              error={errors?.prefix?.message}
              className="col-span-1"
            >
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
              />
            </FormRow>
            <FormRow
              label="Suffisso"
              error={errors?.suffix?.message}
              className="col-span-1"
            >
              <FormSelect
                id="suffix"
                {...register("suffix")}
                options={[
                  { value: "MD", label: "MD" },
                  { value: "PhD", label: "PhD" },
                  { value: "DO", label: "DO" },
                ]}
              />
            </FormRow>
          </>
        )}
        {step === 3 && (
          <>
            <NavigationButtons
              step={step}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleSubmit(handleNextStep)}
              isFinalStep={false}
            />
            <h2 className="col-span-2 mb-4 text-xl font-bold text-cyan-950">
              {steps[2]}
            </h2>
            <FormRow
              label="Telefono"
              error={errors?.phone?.message}
              className="col-span-1"
            >
              <FormInput
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Indirizzo"
              error={errors?.address?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="address"
                {...register("address", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Numero Civico"
              error={errors?.line?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="line"
                {...register("line", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Città"
              error={errors?.city?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="city"
                {...register("city", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Stato"
              error={errors?.state?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="state"
                {...register("state", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Codice Postale"
              error={errors?.postalCode?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Paese"
              error={errors?.country?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="country"
                {...register("country", {
                  required: "Questo campo è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Organizzazione"
              error={errors?.organization?.message}
              className="col-span-2"
            >
              <FormSelect
                id="organization"
                {...register("organization", {
                  required: "Questo campo è obbligatorio",
                })}
                options={organizations}
              />
            </FormRow>
          </>
        )}
        {step === 4 && (
          <>
            <NavigationButtons
              step={step}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleSubmit(handleNextStep)}
              isFinalStep={true}
            />
            <h2 className="col-span-2 mb-4 text-xl font-bold text-cyan-950">
              {steps[3]}
            </h2>

            <FormRow
              label="Codice Qualifica"
              error={errors?.qualificationCode?.message}
              className="col-span-1"
            >
              <FormSelect
                id="qualificationCode"
                {...register("qualificationCode", {
                  required: "Questo campo è obbligatorio",
                })}
                options={qualifications}
              />
            </FormRow>
            <FormRow
              label="Stato della Qualifica"
              error={errors?.qualificationStatus?.message}
              className="col-span-1"
            >
              <FormSelect
                id="qualificationStatus"
                {...register("qualificationStatus", {
                  required: "Questo campo è obbligatorio",
                })}
                options={qualificationStatuses}
              />
            </FormRow>

            <div className="flex w-full justify-center">
              <Button type="submit" size="large" variant="primary">
                {isPending ? <SmallSpinner /> : "Registrati"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default PractitionerSignupForm;
