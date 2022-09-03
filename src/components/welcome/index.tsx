import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Welcome() {
  const { pathname } = useRouter();
  const { data, status } = useSession();
  if (status === "loading") {
    return null;
  }
  return (
    <div className="box-border flex h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
      <h2 className="text-center text-3xl">Discover &amp; Create Mixtapes</h2>
      {!data && (
        <button
          className="mt-2 flex items-center justify-between gap-x-3 rounded-full px-4 py-1 text-lg font-semibold text-spotify-green"
          onClick={() =>
            signIn("spotify", {
              callbackUrl: pathname === "/" ? "/create-playlist" : pathname,
            })
          }
        >
          <svg
            aria-hidden
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1333.33 1333.3"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path
              d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z"
              fill="#1DB954"
              fillRule="nonzero"
            />
          </svg>
          Sign in with Spotify
        </button>
      )}
      <div className="mt-10">
        <p className="flex items-center gap-4 text-lg">
          <span>
            Created with{" "}
            <a
              className="underline underline-offset-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://create.t3.gg/"
            >
              T3 stack
            </a>
            .
          </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/tohuynh/spotify-playlist"
          >
            <svg
              viewBox="0 0 24 24"
              aria-label="Source code"
              className="h-6 w-6 fill-zinc-900"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
              />
            </svg>
          </a>
        </p>
      </div>
    </div>
  );
}
