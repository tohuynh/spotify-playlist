import {
  HomeIcon,
  MusicalNoteIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type NavItemProps = {
  label: string;
  icon: ReactNode;
  isCurrent: boolean;
  href: string;
};
function NavItem({ label, icon, isCurrent, href }: NavItemProps) {
  return (
    <li>
      <Link href={href}>
        <a className="flex flex-col items-center">
          <div
            className={`${
              isCurrent && "bg-gray-200"
            } h-8 w-14 rounded-full flex justify-center items-center`}
          >
            {icon}
          </div>
          <div className="text-base font-medium">{label}</div>
        </a>
      </Link>
    </li>
  );
}

const NAVS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className=" h-5 w-5" />,
  },
  {
    href: "/playlists",
    label: "Discover",
    icon: <MusicalNoteIcon className=" h-5 w-5" />,
  },
  {
    href: "/create-playlist",
    label: "Create",
    icon: <PlusIcon className=" h-5 w-5" />,
  },
];

export default function Nav() {
  const { pathname } = useRouter();
  console.log(pathname);
  return (
    <nav className="bg-zinc-50 fixed bottom-0 h-16 w-full md:w-36 md:h-full md:border-t-0 flex flex-row justify-center items-center md:flex-col">
      <ul className="w-full md:w-auto flex flex-row justify-evenly items-center md:flex-col gap-10">
        {NAVS.map((nav) => (
          <NavItem key={nav.href} {...nav} isCurrent={pathname === nav.href} />
        ))}
      </ul>
    </nav>
  );
}
