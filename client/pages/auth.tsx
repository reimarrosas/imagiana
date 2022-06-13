import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Loading from "../components/commons/Loading";
import Tabs from "../components/commons/Tabs";

import { checkAuthStatus } from "../utils/checkAuthStatus";

const Auth: NextPage = () => {
  const router = useRouter();
  const { isLoading, data } = useQuery("authStatus", checkAuthStatus);

  useEffect(() => {
    if (!isLoading && data.success) {
      router.push("/");
    }
  }, [isLoading]);

  return (
    <Loading isLoading={isLoading}>
      <main>
        <div className="img-container">
          <img src="" alt="" />
        </div>
        <Tabs tablist={{ Login: <LoginForm />, "Sign Up": <SignupForm /> }} />
      </main>
    </Loading>
  );
};
export default Auth;
