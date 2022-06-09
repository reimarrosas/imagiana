import { useRouter } from "next/router";
import { FormEventHandler, useReducer, useState } from "react";

import validationReducer, {
  ValidationReducer,
} from "../../utils/validationReducer";
import { emailValidator, passwordValidator } from "../../utils/validators";
import Loading from "../commons/Loading";
import ValidatingFormControl from "../commons/ValidatingFormControl";
import AuthForm from "./AuthForm";

const defaultValidationState = {
  state: "",
  isValid: true,
};

const LoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailState, dispatchEmail] = useReducer<ValidationReducer<string>>(
    validationReducer,
    defaultValidationState
  );
  const [passwordState, dispatchPassword] = useReducer<
    ValidationReducer<string>
  >(validationReducer, defaultValidationState);
  const [result, setResult] = useState("");
  const [keep, setKeep] = useState(false);

  const handleLoginForm: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (emailState.isValid && passwordState.isValid) {
      const { state: email } = emailState;
      const { state: password } = passwordState;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      ).then((raw) => raw.json());
      if (!res.success) {
        setResult(res.message);
        setIsSubmitting(false);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <Loading isLoading={isSubmitting}>
      <p>{result}</p>
      <AuthForm submitHandler={handleLoginForm}>
        <ValidatingFormControl
          type="email"
          label="Email"
          value={emailState.state}
          change={(e) =>
            dispatchEmail({
              newState: e.target.value,
              validator: emailValidator,
            })
          }
          isValid={emailState.isValid}
          error="Email format invalid!"
        />
        <ValidatingFormControl
          type="password"
          label="Password"
          value={passwordState.state}
          change={(e) =>
            dispatchPassword({
              newState: e.target.value,
              validator: passwordValidator,
            })
          }
          isValid={passwordState.isValid}
          error="Password must have at least eight characters, one letter and one number!"
        />
        <div className="my-2">
          <input
            type="checkbox"
            name="keepLoggedIn"
            id="keepLoggedIn"
            checked={keep}
            onChange={(_) => setKeep(!keep)}
          />
          <label htmlFor="keepLoggedIn">Keep logged in?</label>
        </div>
        <div className="my-2 text-right">
          <button type="submit">Login</button>
        </div>
      </AuthForm>
    </Loading>
  );
};

export default LoginForm;
