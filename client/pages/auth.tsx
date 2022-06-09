import type { NextPage } from "next";
import { useState } from "react";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const Auth: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main>
      <div className="img-container">
        <img src="" alt="" />
      </div>
      <div className="form-container">
        <button onClick={(_) => setIsLogin(true)}>Login</button>
        <button onClick={(_) => setIsLogin(false)}>Sign Up</button>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </main>
  );
};

export default Auth;
