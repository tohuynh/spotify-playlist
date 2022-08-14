import { signIn, signOut, useSession } from "next-auth/react";

export default function Intro() {
  const { data } = useSession();

  return (
    <>
      <h1>{`Hello, ${data?.user?.name || "Guest"}`}</h1>
      <h2>Welcome to Tiny MixTapes</h2>
      <button
        className="px-4 py-2 border-2 border-blue-500 rounded-md"
        onClick={data ? () => signOut() : () => signIn("spotify")}
      >
        {data ? "Sign out" : "Sign in"}
      </button>
    </>
  );
}
