"use client";

import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DeleteBlock = ({ id }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const deleteTicket = async () => {
    if (session.user.role === "admin") {
      let text = "Are you sure you want to delete the ticket";
      if (confirm(text) == true) {
        const res = await fetch(`https://support.edgewatermc.com.au/api/Tickets/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          router.refresh();
        }
      } else {
        return;
      }
    } else {
      alert(
        "You are not authorized to delete tickets, please contact IT department."
      );
    }
  };

  return (
    <FontAwesomeIcon
      icon={faX}
      className=" text-red-400 hover:cursor-pointer hover:text-red-200"
      onClick={deleteTicket}
    />
  );
};

export default DeleteBlock;
