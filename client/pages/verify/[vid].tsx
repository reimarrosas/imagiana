import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Loading from "../../components/commons/Loading";
import { singleUseQueryOption } from "../../utils/constants";
import { queryBuilder } from "../../utils/queries/queryBuilder";

const verificationQuery = (vid?: string | string[]) =>
  queryBuilder(`/auth/verify?id=${vid}`, "get", {});

const Verify: NextPage = ({
  vid,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isIdle, data } = useQuery(
    "verificationEmail",
    () => verificationQuery(vid),
    singleUseQueryOption
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const { vid } = ctx.query;

  await queryClient.prefetchQuery(
    "verificationEmail",
    () => verificationQuery(vid),
    singleUseQueryOption
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      vid,
    },
  };
};

export default Verify;
