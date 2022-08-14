import { signIn, signOut, useSession } from "next-auth/react";

const login = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const logout = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

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
        {data ? logout : login}
      </button>
    </div>
  );
}
