import { useState } from "react";
import { useForm } from "react-hook-form";
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

  // Lista statica delle qualifiche
  const qualifications = [
    { value: "MD", label: "Doctor of Medicine" },
    { value: "PhD", label: "Doctor of Philosophy" },
    { value: "DO", label: "Doctor of Osteopathic Medicine" },
    // Aggiungi altre qualifiche se necessario
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
            },
          ],
        },
        birthDate: data.birthDate,
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
            identifier: {
              system: "http://hospital.example.org/qualifications",
              value: data.qualificationIdentifier,
            },
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
                  code: "active",
                  display: "Active",
                },
              ],
            },
            issuer: {
              reference: "Organization/1",
              display: data.issuingOrganization,
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
              label="Username"
              error={errors?.username?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="username"
                {...register("username", {
                  required: "This field is required",
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
                  required: "This field is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please provide a valid email address",
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
                  required: "This field is required",
                  minLength: {
                    value: 8,
                    message: "Password needs a minimum of 8 characters",
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
                  required: "This field is required",
                  validate: (value) =>
                    value === getValues().password || "Passwords need to match",
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
              label="First Name"
              error={errors?.firstName?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Last Name"
              error={errors?.lastName?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Birth Date"
              error={errors?.birthDate?.message}
              className="col-span-1"
            >
              <FormInput
                type="date"
                id="birthDate"
                {...register("birthDate", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Gender"
              error={errors?.gender?.message}
              className="col-span-1"
            >
              <FormSelect
                id="gender"
                {...register("gender", { required: "This field is required" })}
                options={[
                  { value: "male", label: "Maschio" },
                  { value: "female", label: "Femmina" },
                  { value: "other", label: "Altro" },
                ]}
              />
            </FormRow>
            <FormRow
              label="Prefix"
              error={errors?.prefix?.message}
              className="col-span-1"
            >
              <FormSelect
                id="prefix"
                {...register("prefix")}
                options={[
                  { value: "Dr.", label: "Dr." },
                  { value: "Prof.", label: "Prof." },
                  // Add more prefixes as needed
                ]}
              />
            </FormRow>
            <FormRow
              label="Suffix"
              error={errors?.suffix?.message}
              className="col-span-1"
            >
              <FormSelect
                id="suffix"
                {...register("suffix")}
                options={[
                  { value: "MD", label: "MD" },
                  { value: "PhD", label: "PhD" },
                  // Add more suffixes as needed
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
              label="Phone"
              error={errors?.phone?.message}
              className="col-span-1"
            >
              <FormInput
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Address"
              error={errors?.address?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="address"
                {...register("address", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Line"
              error={errors?.line?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="line"
                {...register("line", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="City"
              error={errors?.city?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="city"
                {...register("city", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="State"
              error={errors?.state?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="state"
                {...register("state", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Postal Code"
              error={errors?.postalCode?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Country"
              error={errors?.country?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="country"
                {...register("country", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Organization"
              error={errors?.organization?.message}
              className="col-span-2"
            >
              <FormSelect
                id="organization"
                {...register("organization", {
                  required: "This field is required",
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
              label="Qualification Identifier"
              error={errors?.qualificationIdentifier?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="qualificationIdentifier"
                {...register("qualificationIdentifier", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Qualification Code"
              error={errors?.qualificationCode?.message}
              className="col-span-1"
            >
              <FormSelect
                id="qualificationCode"
                {...register("qualificationCode", {
                  required: "This field is required",
                })}
                options={qualifications}
              />
            </FormRow>
            <FormRow
              label="Qualification Status"
              error={errors?.qualificationStatus?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="qualificationStatus"
                {...register("qualificationStatus", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow
              label="Issuing Organization"
              error={errors?.issuingOrganization?.message}
              className="col-span-1"
            >
              <FormInput
                type="text"
                id="issuingOrganization"
                {...register("issuingOrganization", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <Button type="submit">
              {isPending ? <SmallSpinner /> : "Registrati"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default PractitionerSignupForm;
