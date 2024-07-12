import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
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
            line: data.line,
            city: data.city,
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
              label="Phone"
              error={errors?.phone?.message}
              className="col-span-2"
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
              label="Indirizzo"
              error={errors?.address?.message}
              className="col-span-2"
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
              label="Numero Civico"
              error={errors?.line?.message}
              className="col-span-2"
            >
              <FormInput
                type="number"
                id="line"
                {...register("line", {
                  required: "Il numero civico è obbligatorio",
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
            <Button type="submit" className="col-span-2">
              {isPending ? <SmallSpinner /> : "Registrati"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default PatientSignupForm;
