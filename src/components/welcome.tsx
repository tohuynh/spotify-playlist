import { signIn } from "next-auth/react";

// TODO: spotify logo on button
export default function Welcome() {
  return (
    <div className="h-[calc(100vh-8rem)] box-border flex flex-col justify-center items-center">
      <h2 className="text-xl">Sign in with Spotify to create mixtapes.</h2>
      <button onClick={() => signIn("spotify")}>Sign in</button>
    </div>
  );
}
