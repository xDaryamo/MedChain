import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { format, differenceInYears } from "date-fns";
import FormRow from "./FormRow";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import ProgressBar from "./ProgressBar";
import { useSignup } from "../features/authentication/useAuth";
import Button from "./Button";
import NavigationButtons from "./NavigationButtons";
import SmallSpinner from "./SmallSpinner";

const PatientSignupForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  const [step, setStep] = useState(1);

  const { signup, isPending } = useSignup();

  const handleNextStep = (data) => {
    if (step === 1 && data.password !== data.confirmPassword) {
      toast.error("Le password non corrispondono.");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    const names = data.firstName.split(" ");
    const formattedDate = data.birthDate
      ? format(new Date(data.birthDate), "yyyy-MM-dd'T'HH:mm:ssXXX")
      : undefined;

    const finalData = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: "patient",
      organization: "patients.medchain.com",
      fhirData: {
        identifier: {
          system: "http://hospital.smarthealthit.org",
          value: "",
        },
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
                  system: "http://hl7.org/fhir/contact-point-system",
                  code: "phone",
                },
              ],
            },
            value: data.phone,
            use: {
              coding: [
                {
                  system: "http://hl7.org/fhir/contact-point-use",
                  code: "home",
                },
              ],
            },
          },
          {
            system: {
              coding: [
                {
                  system: "http://hl7.org/fhir/contact-point-system",
                  code: "email",
                },
              ],
            },
            value: data.email,
            use: {
              coding: [
                {
                  system: "http://hl7.org/fhir/contact-point-use",
                  code: "work",
                },
              ],
            },
          },
        ],
        gender: {
          coding: [
            {
              system: "http://hl7.org/fhir/administrative-gender",
              code: data.gender,
            },
          ],
        },
        date: formattedDate,
        address: [
          {
            use: {
              coding: [
                {
                  system: "http://hl7.org/fhir/address-use",
                  code: "home",
                },
              ],
            },
            text: data.address,
            line: data.line.toString(),
            city: data.city,
            postalcode: data.postalCode.toString(),
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
    "Contatti e Indirizzo",
  ];

  return (
    <div>
      <ProgressBar currentStep={step} steps={steps} />
      <form
        onSubmit={handleSubmit(step === 3 ? onSubmit : handleNextStep)}
        className="space-y-4 md:grid md:gap-4"
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
              label="Nome Utente"
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
                    message: "Inserisci un indirizzo email valido",
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
                    message: "La password deve contenere almeno 8 caratteri",
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
                    "Le password devono corrispondere",
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
                  validate: (value) => {
                    const age = differenceInYears(new Date(), new Date(value));
                    return age >= 18 || "La data di nascita è troppo recente";
                  },
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
          </>
        )}
        {step === 3 && (
          <>
            <NavigationButtons
              step={step}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleSubmit(handleNextStep)}
              isFinalStep={true}
            />
            <h2 className="col-span-2 mb-4 text-xl font-bold text-cyan-950">
              {steps[2]}
            </h2>
            <FormRow
              label="Telefono"
              error={errors?.phone?.message}
              className="col-span-2"
            >
              <FormInput
                type="tel"
                id="phone"
                {...register("phone", {
                  required: "Questo campo è obbligatorio",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Inserisci un numero di telefono valido",
                  },
                })}
              />
            </FormRow>
            <FormRow
              label="Indirizzo"
              error={errors?.address?.message}
              className="col-span-2"
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
              className="col-span-2"
            >
              <FormInput
                type="number"
                id="line"
                {...register("line", {
                  required: "Il numero civico è obbligatorio",
                  valueAsNumber: true,
                })}
              />
            </FormRow>
            <FormRow
              label="Città"
              error={errors?.city?.message}
              className="col-span-2"
            >
              <FormInput
                type="text"
                id="city"
                {...register("city", {
                  required: "La città è obbligatoria",
                })}
              />
            </FormRow>
            <FormRow
              label="Codice Postale"
              error={errors?.postalCode?.message}
              className="col-span-2"
            >
              <FormInput
                type="text"
                id="postalCode"
                {...register("postalCode", {
                  required: "Il codice postale è obbligatorio",
                  valueAsNumber: true,
                })}
              />
            </FormRow>
            <FormRow
              label="Paese"
              error={errors?.country?.message}
              className="col-span-2"
            >
              <FormInput
                type="text"
                id="country"
                {...register("country", {
                  required: "Il paese è obbligatorio",
                })}
              />
            </FormRow>
            <FormRow
              label="Stato Civile"
              error={errors?.maritalStatus?.message}
              className="col-span-2"
            >
              <FormInput
                type="text"
                id="maritalStatus"
                {...register("maritalStatus")}
              />
            </FormRow>
            <div className="col-span-2 flex justify-center">
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                size="large"
              >
                {isPending ? <SmallSpinner /> : "Registrati"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default PatientSignupForm;
