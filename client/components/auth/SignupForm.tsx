import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, FormEvent, useReducer, useState } from "react";

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
import ValidatingFormControl from "../commons/ValidatingFormControl";
import AuthForm from "./AuthForm";

const defaultValidationState = {
  state: "",
  isValid: true,
};

const SignupForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    if (
      fullNameState.isValid &&
      emailState.isValid &&
      passwordState.isValid &&
      verifyPasswordState.isValid
    ) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullNameState.state,
            email: emailState.state,
            password: passwordState.state,
          }),
        }
      ).then((raw) => raw.json());
      if (!res.success) {
        setIsSubmitting(false);
        setResult(res.message);
      } else {
        router.push("/registerSuccess");
      }
    }
  };

  return (
    <Loading isLoading={isSubmitting}>
      <p>{result}</p>
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
        <div className="my-2">
          <button type="submit">Sign Up</button>
        </div>
      </AuthForm>
    </Loading>
  );
};

export default SignupForm;
