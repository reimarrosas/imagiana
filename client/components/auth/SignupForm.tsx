import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, FormEvent, useReducer, useState } from "react";
import { useMutation } from "react-query";
import { queryBuilder } from "../../utils/queries/queryBuilder";

import validationReducer, {
  ValidationAction,
  ValidationReducer,
} from "../../utils/validationReducer";
import {
  emailValidator,
  fullNameValidator,
  passwordValidator,
  verifyPasswordValidator,
} from "../../utils/validators";
import Loading from "../commons/Loading";
import MainButton from "../commons/MainButton";
import ValidatingFormControl from "../commons/ValidatingFormControl";
import AuthForm from "./AuthForm";

const defaultValidationState = {
  state: "",
  isValid: true,
};

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const router = useRouter();
  const mutation = useMutation(
    (signupData: SignupData) =>
      queryBuilder("/auth/signup", "post", signupData)(),
    {
      onSuccess: (data, _v) =>
        data.success ? router.push("/signupSuccess") : setResult(data.message),
    }
  );
  const [fullNameState, dispatchFullName] = useReducer<
    ValidationReducer<string>
  >(validationReducer, defaultValidationState);
  const [emailState, dispatchEmail] = useReducer<ValidationReducer<string>>(
    validationReducer,
    defaultValidationState
  );
  const [passwordState, dispatchPassword] = useReducer<
    ValidationReducer<string>
  >(validationReducer, defaultValidationState);
  const [verifyPasswordState, dispatchVerifyPassword] = useReducer<
    ValidationReducer<string>
  >(validationReducer, defaultValidationState);
  const [result, setResult] = useState("");

  const changeHandler =
    (d: Dispatch<ValidationAction<string>>, validator: (_: any) => boolean) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      d({ newState: e.target.value, validator });

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (
      fullNameState.isValid &&
      emailState.isValid &&
      passwordState.isValid &&
      verifyPasswordState.isValid
    ) {
      const { state: fullName } = fullNameState;
      const { state: email } = emailState;
      const { state: password } = passwordState;
      mutation.mutate({ fullName, email, password });
    }
  };

  return (
    <div className={mutation.isLoading ? "grid place-content-center" : ""}>
      <Loading isLoading={mutation.isLoading}>
        <AuthForm submitHandler={submitHandler}>
          <ValidatingFormControl
            type="text"
            label="Full Name"
            value={fullNameState.state}
            change={changeHandler(dispatchFullName, fullNameValidator)}
            required
            isValid={fullNameState.isValid}
            error="Full name must not be empty!"
          />
          <ValidatingFormControl
            type="email"
            label="Email"
            value={emailState.state}
            change={changeHandler(dispatchEmail, emailValidator)}
            required
            isValid={emailState.isValid}
            error="Email has invalid format!"
          />
          <ValidatingFormControl
            type="password"
            label="Password"
            value={passwordState.state}
            change={changeHandler(dispatchPassword, passwordValidator)}
            required
            isValid={passwordState.isValid}
            error="Password must have at least eight characters, one letter and one number"
          />
          <ValidatingFormControl
            type="password"
            label="Verify Password"
            value={verifyPasswordState.state}
            change={changeHandler(
              dispatchVerifyPassword,
              verifyPasswordValidator(passwordState.state)
            )}
            required
            isValid={verifyPasswordState.isValid}
            error="Password does not match!"
          />
          <p className="text-center text-red-600">{result}</p>
          <div className="my-6 text-right">
            <MainButton type="submit">Sign Up</MainButton>
          </div>
        </AuthForm>
      </Loading>
    </div>
  );
};

export default SignupForm;
