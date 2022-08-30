import {
  HomeIcon,
  MusicalNoteIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav() {
  const { pathname } = useRouter();
  console.log(pathname);
  return (
    <nav className="bg-white fixed bottom-0 h-16 w-full md:w-36 md:h-full md:border-t-0 flex flex-row justify-center items-center md:flex-col">
      <ul className="w-full md:w-auto flex flex-row justify-evenly items-center md:flex-col gap-16">
        <li>
          <Link href="/">
            <a>
              <HomeIcon
                className={`${
                  pathname === "/" && "text-spotify-green"
                } h-6 w-6`}
              />
            </a>
          </Link>
        </li>
        <li>
          <Link href="/playlists">
            <a>
              <MusicalNoteIcon
                className={`${
                  pathname === "/playlists" && "text-spotify-green"
                } h-6 w-6`}
              />
            </a>
          </Link>
        </li>
        <li>
          <Link href="/create-playlist">
            <a>
              <PlusIcon
                className={`${
                  pathname === "/create-playlist" && "text-spotify-green"
                } h-6 w-6`}
              />
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
