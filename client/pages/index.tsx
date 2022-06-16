import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import Navigation from "../components/home/Navigation";
import MainSection from "../components/home/MainSection";

import { checkAuthStatus } from "../utils/queries/checkAuthStatus";
import Loading from "../components/commons/Loading";

export interface User {
  id: string;
  fullName: string;
  email: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { isLoading, data, refetch } = useQuery("authStatus", checkAuthStatus);
  const [isLogoutSuccess, setIsLogoutSuccess] = useState(false);
  const [user, setUser] = useState<User>({ id: "", email: "", fullName: "" });
  useEffect(() => {
    if (!isLoading) {
      if (!data.success) {
        router.push("/auth");
      } else {
        setUser(data.user);
      }
    }
  }, [data]);

  useEffect(() => {
    if (isLogoutSuccess) refetch();
    return () => setIsLogoutSuccess(false);
  }, [isLogoutSuccess]);

  return (
    <div className={isLoading ? "grid place-content-center min-h-screen" : ""}>
      <Loading isLoading={isLoading}>
        <Navigation user={user} setIsLogoutSuccess={setIsLogoutSuccess} />;
        <MainSection user={user} />
      </Loading>
    </div>
  );
};

export default Home;
