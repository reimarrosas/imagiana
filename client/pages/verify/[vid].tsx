import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loading from "../../components/commons/Loading";

interface VerificationState {
  isLoading: boolean;
  isVerified: boolean;
  verificationMessage: string;
}

const Verify: NextPage = () => {
  const router = useRouter();
  const { vid } = router.query;

  const [verified, setVerified] = useState<VerificationState>({
    isVerified: false,
    verificationMessage: "",
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify?id=${vid}`
      ).then((raw) => raw.json());

      setVerified({
        verificationMessage: res.message,
        isLoading: false,
        isVerified: !!res.success,
      });
    })();
  }, []);

  return (
    <main className="grid min-h-screen place-content-center">
      <div className="text-center">
        <Loading isLoading={verified.isLoading}>
          <h1 className="text-4xl text-emerald-900 font-semibold mb-4">
            {verified.verificationMessage}
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
