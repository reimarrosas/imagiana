import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

const Home: NextPage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data, isLoading, isFetching } = useQuery(
    "authStatus",
    authStatusQuery()
  );

  useEffect(() => {
    if (!isFetching && !data?.success) {
      router.push("/auth");
    }
  }, [isFetching]);

  return (
    <div className={isLoading ? "grid place-content-center min-h-screen" : ""}>
      <Loading isLoading={isLoading}>
        <Navigation user={user} />
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
