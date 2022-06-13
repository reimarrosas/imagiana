import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { checkAuthStatus } from "../utils/checkAuthStatus";

interface User {
  id: "string";
  fullName: string;
  email: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { data } = useQuery("authStatus", checkAuthStatus);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    if (!data.success) {
      router.push("/auth");
    } else {
      setUser(data.user);
    }
  }, [data.success]);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello, World!</h1>
      <pre>{user && JSON.stringify(user, null, 4)}</pre>
    </>
  );
};

export default Home;
