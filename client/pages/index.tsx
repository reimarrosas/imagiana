import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import { QueryClient, useQuery } from "react-query";

import Navigation from "../components/home/Navigation";
import MainSection from "../components/home/MainSection";

import Loading from "../components/commons/Loading";
import { authStatusQuery } from "../utils/queries/checkAuthStatus";
import { postQuery } from "../utils/queries/fetchAllPosts";

export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface UserQueryData {
  message: string;
  error?: string;
  success?: boolean;
  user?: User;
}

const Home: NextPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isLoading } = useQuery("authStatus", authStatusQuery());

  return (
    <div
      className={
        isLoading || isLoggingOut
          ? "grid place-content-center min-h-screen"
          : ""
      }
    >
      <Loading isLoading={isLoading || isLoggingOut}>
        <Navigation user={user} loadLogout={setIsLoggingOut} />
        <MainSection user={user} />
      </Loading>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const queryClient = new QueryClient();

  const res = await queryClient.fetchQuery(
    "authStaus",
    authStatusQuery({ Cookie: req.headers.cookie })
  );

  if (!res.success) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery(
    "getPosts",
    postQuery({ Cookie: req.headers.cookie })
  );

  return {
    props: {
      user: res.user,
    },
  };
};

export default Home;
