import { signIn, signOut, useSession } from "next-auth/react";
import { LoginIcon, LogoutIcon } from "@heroicons/react/outline";

export default function AppBar() {
  const { data, status } = useSession();

  if (status === "loading") {
    return null;
  }

  return (
    <div className="px-4 md:px-8 xl:px-16 flex flex-row justify-between items-center h-16 shadow-md bg-white">
      <h1 className="xl:text-2xl font-medium">
        {data ? `Hello, ${data.user?.name}` : "Hello, Guest"}
      </h1>
      <button
        aria-label={data ? "Sign out" : "Sign in"}
        onClick={data ? () => signOut() : () => signIn("spotify")}
      >
        {data ? (
          <LogoutIcon className="h-6 w-6" aria-hidden />
        ) : (
          <LoginIcon className="h-6 w-6" aria-hidden />
        )}
      </button>
    </div>
  );
}
