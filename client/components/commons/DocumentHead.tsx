import Head from "next/head";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const DocumentHead = ({ children }: Props) => (
  <>
    <Head>
      <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Imagiana, A Social-Networking App for sharing your experiences." />
      <meta name="keywords" content="Images, Experiences, Sharing, Social" />
      <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
      <title>Imagiana: Share your experience!</title>
    </Head>
    {children}
  </>
);

export default DocumentHead;
