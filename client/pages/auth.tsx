import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dehydrate, QueryClient, useQuery } from "react-query";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import Loading from "../components/commons/Loading";
import Tabs from "../components/commons/Tabs";
import { authStatusQuery } from "../utils/queries/checkAuthStatus";

const Auth: NextPage = () => {
  const router = useRouter();
  const { isFetching, isLoading, data } = useQuery(
    "authStatus",
    authStatusQuery()
  );

  useEffect(() => {
    if (!isFetching && data?.success) {
      router.push("/");
    }
  }, [isFetching]);

  return (
    <div
      className={`${isLoading ? "grid place-content-center min-h-screen" : ""}`}
    >
      <Loading isLoading={isLoading}>
        <main className="flex sm:flex-row flex-col min-h-screen">
          <div className="grid place-content-center relative sm:order-first order-last basis-2/3 bg-slate-900 p-4">
            <Image
              src="/images/hero_image.svg"
              layout="fill"
              objectFit="contain"
              objectPosition="50% 50%"
              alt=""
            />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();

  const res = await queryClient.fetchQuery(
    "authStatus",
    authStatusQuery({ Cookie: req.headers.cookie })
  );

  if (res.success) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Auth;
