"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import emailjs from "@emailjs/browser";

const EditTicketForm = ({ ticket }) => {
  const { data: session, status } = useSession();
  const EDITMODE = ticket._id === "new" ? false : true;
  const router = useRouter();
  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "Hardware Problem",
    location: "edgewater",
    userEmail: session?.user.email,
    userName: session?.user.name,
  };

  if (EDITMODE) {
    startingTicketData["title"] = ticket.title;
    startingTicketData["description"] = ticket.description;
    startingTicketData["priority"] = ticket.priority;
    startingTicketData["progress"] = ticket.progress;
    startingTicketData["status"] = ticket.status;
    startingTicketData["category"] = ticket.category;
    startingTicketData["userEmail"] = ticket.userEmail;
    startingTicketData["userName"] = ticket.userName;
    startingTicketData["location"] = ticket.location;
  }

  const [formData, setFormData] = useState(startingTicketData);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (EDITMODE) {
      const res = await fetch(`/api/Tickets/${ticket._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      if (!res.ok) {
        throw new Error("Failed to update ticket");
      }
    } else {
      const res = await fetch("/api/Tickets", {
        method: "POST",
        body: JSON.stringify({ formData }),
        //@ts-ignore
        "Content-Type": "application/json",
      });
      if (!res.ok) {
        throw new Error("Failed to create ticket");
      }
    }
    if (session.user.role === "user") {
      emailjs
        .send(
          "service_1ulxjx9",
          "template_6bwtmyl",
          {
            // from_name: "Jan",
            // to_name: "user",
            userName: formData.userName,
            userEmail: formData.userEmail,
            location: formData.location,
          },
          "rN-sz6ARuUED8RbNL"
        )
        .then(
          (result) => {
            if (result.status === 200) {
              console.log("email sent");
            }
          },
          (error) => {
            console.log(error.text);
          }
        );
    }

    router.replace("/");
    router.refresh();
  };

  const categories = [
    "Hardware Problem",
    "Software Problem",
    "Application Development",
    "Project",
  ];

  return (
    <div className=" flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-3/4"
      >
        <input
          id="userEmail"
          name="userEmail"
          type="text"
          required={true}
          hidden
          value={session?.user.email}
        />
        <input
          id="userName"
          name="userName"
          type="text"
          required={true}
          hidden
          value={session?.user.email}
        />
        <h3>{EDITMODE ? "Update Your Ticket" : "Create New Ticket"}</h3>
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />
        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows="5"
          placeholder="Please descripe the issue including the specific area at the clinic"
        />
        <label>Location</label>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
        >
          <option value="Edgewater">Edgewater Medical Clinic</option>
          <option value="Fairfield">Fairfield City Midical Clinic</option>
          <option value="Glenroy">Glenroy Medical Clinic</option>
          <option value="Calder">Calder Medical Clinic</option>
          <option value="Trentham">Trentham Medical Clinic</option>
        </select>

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories?.map((category, _index) => (
            <option key={_index} value={category}>
              {category}
            </option>
          ))}
        </select>
        {session?.user.role === "admin" && (
          <>
            <label>Priority</label>
            <div>
              <input
                id="priority-1"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={1}
                checked={formData.priority == 1}
              />
              <label>1</label>
              <input
                id="priority-2"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={2}
                checked={formData.priority == 2}
              />
              <label>2</label>
              <input
                id="priority-3"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={3}
                checked={formData.priority == 3}
              />
              <label>3</label>
              <input
                id="priority-4"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={4}
                checked={formData.priority == 4}
              />
              <label>4</label>
              <input
                id="priority-5"
                name="priority"
                type="radio"
                onChange={handleChange}
                value={5}
                checked={formData.priority == 5}
              />
              <label>5</label>
            </div>
            <label>Progress</label>
            <input
              type="range"
              id="progress"
              name="progress"
              value={formData.progress}
              min="0"
              max="100"
              onChange={handleChange}
            />
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not started">Not Started</option>
              <option value="started">Started</option>
              <option value="done">Done</option>
            </select>
          </>
        )}
        <div className="flex justify-around">
          <input
            type="submit"
            className="btn max-w-xs"
            value={EDITMODE ? "Update" : "Create"}
          />
          <input
            className="btn max-w-xs"
            value="Cancel"
            onClick={() => router.back()}
          />
        </div>
      </form>
    </div>
  );
};

export default EditTicketForm;
