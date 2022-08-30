import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AppBar() {
  const { pathname } = useRouter();
  const { data, status } = useSession();

  if (status === "loading") {
    return null;
  }

  //TODO: distinguish on md visually distinguish between app bar and nav

  return (
    <div className="flex h-16 flex-row items-center justify-between bg-white px-4 md:px-8 md:ml-36 xl:px-16">
      <h1 className="basis-3/4 truncate text-lg lg:text-2xl">
        {data ? `Hello, ${data.user?.name}` : "Hello, Guest"}
      </h1>
      <button
        aria-label={data ? "Sign out" : "Sign in"}
        onClick={
          data
            ? () => signOut()
            : () =>
                signIn("spotify", {
                  callbackUrl: pathname === "/" ? "/create-playlist" : pathname,
                })
        }
      >
        {data ? (
          <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden />
        ) : (
          <ArrowLeftOnRectangleIcon className="h-6 w-6" aria-hidden />
        )}
      </button>
    </div>
  );
}
