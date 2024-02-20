import React from "react";
import TicketCard from "./(components)/TicketCard";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

const getTickets = async () => {
  const session = await getServerSession();
  console.log(session.user);
  const email = session?.user.role !== "admin" ? session?.user.email : "";

  try {
    const res = await fetch(
      `https://support.edgewatermc.com.au/api/Tickets?usremail=${email}`,
      {
        cache: "no-store",
        method: "GET",
        headers: headers(),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch tickets");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading tickets: ", error);
  }
};

const Dashboard = async () => {
  const data = await getTickets();

  // Make sure we have tickets needed for production build.
  if (!data?.tickets) {
    return <p>No tickets.</p>;
  }

  const tickets = data.tickets;

  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      <div>
        {tickets && tickets.length > 0 ? (
          uniqueCategories?.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-4">
              <h2>{uniqueCategory}</h2>
              <div className="lg:grid grid-cols-2 xl:grid-cols-4 ">
                {tickets
                  .filter((ticket) => ticket.category === uniqueCategory)
                  .map((filteredTicket, _index) => (
                    <TicketCard
                      id={_index}
                      key={_index}
                      ticket={filteredTicket}
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            <h1>No tickets available</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
