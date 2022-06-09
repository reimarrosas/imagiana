import { FormEventHandler, ReactNode } from "react";

interface Props {
  formClass?: string;
  children: ReactNode;
  submitHandler?: FormEventHandler<HTMLFormElement>;
}

const AuthForm = ({ formClass, children, submitHandler }: Props) => (
  <form onSubmit={submitHandler} className={`w-1/4 ${formClass}`}>
    {children}
  </form>
);

export default AuthForm;
