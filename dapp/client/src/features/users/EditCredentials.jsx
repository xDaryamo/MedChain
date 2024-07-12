import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateCredentials, useUser } from "../authentication/useAuth";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import SmallSpinner from "../../ui/SmallSpinner";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { useNavigate } from "react-router-dom";

const EditCredentials = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const { updateCredentials, isPending } = useUpdateCredentials();
  const { user, isPending: isUserPending } = useUser();

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const navigate = useNavigate();
  const onSubmit = (data) => {
    // Check if password fields are filled
    const isPasswordUpdate =
      data.oldPassword && data.password && data.confirmPassword;

    if (isPasswordUpdate) {
      updateCredentials(data);
    } else {
      // eslint-disable-next-line no-unused-vars
      const { oldPassword, password, confirmPassword, ...updateData } = data;
      updateCredentials(updateData);
    }
  };

  if (isUserPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mr-auto">
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Heading>Modifica le tue credenziali</Heading>
        <FormRow label="Nome utente" error={errors?.username?.message}>
          <FormInput
            type="text"
            id="username"
            {...register("username", {
              required: "Questo campo è obbligatorio",
            })}
          />
        </FormRow>
        <FormRow label="Email" error={errors?.email?.message}>
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
        <FormRow label="Vecchia Password" error={errors?.oldPassword?.message}>
          <FormInput
            type="password"
            id="oldPassword"
            {...register("oldPassword")}
          />
        </FormRow>
        <FormRow label="Nuova Password" error={errors?.password?.message}>
          <FormInput
            type="password"
            id="password"
            {...register("password", {
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
        >
          <FormInput
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) =>
                value === getValues().password ||
                "Le password non corrispondono",
            })}
          />
        </FormRow>
        <div className="flex justify-center">
          <Button type="submit" size="large" variant="primary">
            {isPending ? <SmallSpinner /> : "Aggiorna Credenziali"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCredentials;
