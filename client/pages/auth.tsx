import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Loading from "../components/commons/Loading";
import Tabs from "../components/commons/Tabs";

import { checkAuthStatus } from "../utils/queries/checkAuthStatus";

const Auth: NextPage = () => {
  const router = useRouter();
  const { isLoading, data, isFetching } = useQuery(
    "authStatus",
    checkAuthStatus
  );

  useEffect(() => {
    if (!isFetching && data?.success) {
      router.push("/");
    }
  }, [isFetching]);

  return (
    <div className={isLoading ? "min-h-screen grid place-content-center" : ""}>
      <Loading isLoading={isLoading}>
        <main className="flex sm:flex-row flex-col min-h-screen">
          <div className="grid place-content-center sm:order-first order-last basis-2/3 bg-slate-900 p-4">
            <img src="/images/hero_image.svg" alt="" />
          </div>
          <Tabs
            sectionClass="flex flex-col justify-center p-8 basis-1/3 max-w-3xl"
            tabClass="flex gap-2 text-lg"
            btnClass="px-4 py-2"
            btnSelectedClass="shadow rounded"
            tablist={{ Login: <LoginForm />, "Sign Up": <SignupForm /> }}
          />
        </main>
      </Loading>
    </div>
  );
};
export default Auth;
