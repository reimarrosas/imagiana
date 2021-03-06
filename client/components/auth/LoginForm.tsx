import { useRouter } from "next/router";
import { FormEventHandler, useReducer, useState } from "react";
import { useMutation } from "react-query";
import { queryBuilder } from "../../utils/queries/queryBuilder";

import validationReducer, {
  ValidationReducer,
} from "../../utils/validationReducer";
import { emailValidator, passwordValidator } from "../../utils/validators";
import Loading from "../commons/Loading";
import MainButton from "../commons/MainButton";
import ValidatingFormControl from "../commons/ValidatingFormControl";
import AuthForm from "./AuthForm";

const defaultValidationState = {
  state: "",
  isValid: true,
};

interface LoginData {
  email: string;
  password: string;
  keep: boolean;
}

const LoginForm = () => {
  const router = useRouter();
  const mutation = useMutation(
    (loginData: LoginData) =>
      queryBuilder(
        `/auth/login${loginData.keep ? "/?keep=true" : ""}`,
        "post",
        {
          email: loginData.email,
          password: loginData.password,
        }
      )(),
    {
      onSuccess: (data, _v) =>
        data.success ? router.push("/") : setResult(data.message),
    }
  );
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
    if (emailState.isValid && passwordState.isValid) {
      const { state: email } = emailState;
      const { state: password } = passwordState;
      mutation.mutate({ email, password, keep });
    }
  };

  return (
    <div className={mutation.isLoading ? "grid place-content-center" : ""}>
      <Loading isLoading={mutation.isLoading}>
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
            />{" "}
            <label htmlFor="keepLoggedIn">Keep logged in?</label>
          </div>
          <p className="text-center text-red-600">{result}</p>
          <div className="my-2 text-right">
            <MainButton type="submit">Login</MainButton>
          </div>
        </AuthForm>
      </Loading>
    </div>
  );
};

export default LoginForm;
