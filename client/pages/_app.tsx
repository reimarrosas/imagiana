import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import DocumentHead from "../components/commons/DocumentHead";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <DocumentHead>
          <Component {...pageProps} />
        </DocumentHead>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
