import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingBar from "react-top-loading-bar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  // Progress bar
  useEffect(() => {
    const handleStart = (url: string) => {
      setProgress(30);
    };
    const handleComplete = (url: string) => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <main id="main">
      <SessionProvider session={session}>
        <Navbar />
        <LoadingBar
          color="#ff0084"
          height={3}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}
