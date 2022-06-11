import type { NextPage } from "next";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Tabs from "../components/commons/Tabs";

const Auth: NextPage = () => (
  <main>
    <div className="img-container">
      <img src="" alt="" />
    </div>
    <Tabs tablist={{ Login: <LoginForm />, "Sign Up": <SignupForm /> }} />
  </main>
);

export default Auth;
