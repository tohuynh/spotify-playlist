import { signIn, signOut, useSession } from "next-auth/react";
import { LoginIcon, LogoutIcon } from "@heroicons/react/outline";

export default function AppBar() {
  const { data, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return (
    <div className="px-4 md:px-8 xl:px-16 flex flex-row justify-between items-center h-16 bg-white border-b border-b-slate-100">
      <h1 className="basis-3/4 text-lg lg:text-2xl truncate">
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
