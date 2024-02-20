"use client";
import { faHome, faTicket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const NavItems = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between bg-nav px-20 py-4">
      <div className="flex items-center space-x-10">
        <Link href="/">
          <FontAwesomeIcon icon={faHome} className="icon" />
        </Link>
        {session?.user && (
          <Link className="flex flex-row items-center gap-2" href="/ticket/new">
            <FontAwesomeIcon icon={faTicket} className="icon" />
            <p className=" text-default-text text-center">
              Create a new ticket
            </p>
          </Link>
        )}
      </div>

      {session?.user ? (
        <div className="flex gap-5 mr-3 p-3">
          <div className="flex gap-1">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <p className=" text-default-text text-lg">{session.user.name}</p>
          </div>
          <p
            className=" text-default-text text-lg cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </p>
        </div>
      ) : (
        <div className="flex gap-5 mr-3 p-3">
          <Link href="/login">
            <p className=" text-default-text text-lg">Login</p>
          </Link>
          <Link href="/register">
            <p className=" text-default-text text-lg">Register</p>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavItems;
