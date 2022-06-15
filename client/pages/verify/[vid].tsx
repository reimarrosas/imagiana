import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import Loading from "../../components/commons/Loading";
import { verifyEmailAddress } from "../../utils/verifyEmailAddress";

const Verify: NextPage = () => {
  const router = useRouter();
  const { vid } = router.query;

  const { isLoading, isIdle, data } = useQuery(
    "verificationEmail",
    () => verifyEmailAddress(vid as string),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!vid,
    }
  );

  return (
    <main className="grid min-h-screen place-content-center">
      <div className="text-center">
        <Loading isLoading={isIdle || isLoading}>
          <h1 className="text-4xl text-emerald-900 font-semibold mb-4">
            {data?.message}
          </h1>
          <p className="text-lg">
            Click here to go to the{" "}
            <Link href="/auth">
              <a className="underline text-emerald-700">auth page</a>
            </Link>
          </p>
        </Loading>
      </div>
    </main>
  );
};

export default Verify;
