import { LoginIcon, LogoutIcon } from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AppBar() {
  const { data, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return (
    <div className="flex h-16 flex-row items-center justify-between border-b border-b-slate-100 bg-white px-4 md:px-8 xl:px-16">
      <h1 className="basis-3/4 truncate text-lg lg:text-2xl">
        {data ? `Hello, ${data.user?.name}` : "Hello, Guest"}
      </h1>
      <button
        aria-label={data ? "Sign out" : "Sign in"}
        onClick={data ? () => signOut() : () => signIn("spotify")}
      >
        {data ? (
          <LogoutIcon className="h-5 w-5" aria-hidden />
        ) : (
          <LoginIcon className="h-5 w-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
