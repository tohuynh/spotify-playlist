import { Transition } from "@headlessui/react";
import Head from "next/head";
import { ReactNode } from "react";
import toast, { ToastIcon, Toaster, resolveValue } from "react-hot-toast";

import AppBar from "../../components/app-bar";
import Nav from "./nav";

type LayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};
const Layout = ({ title, description, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main className="min-h-screen">
        <AppBar />
        <Nav />
        <div className="px-4 pb-40 md:ml-36 md:px-10 md:pb-10">{children}</div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#ffffff",
              },
            },
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          }}
        >
          {(t) => (
            <Transition
              appear
              show={t.visible}
              className="bg-back flex transform items-center rounded-md p-2 shadow-sm shadow-neutral-400"
              enter="transition-all duration-150"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="transition-all duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-75"
            >
              <ToastIcon toast={t} />
              <div className="max-w-md break-all px-2 text-foreground">
                {resolveValue(t.message, t)}
              </div>
            </Transition>
          )}
        </Toaster>
      </main>
    </>
  );
};

export default Layout;
