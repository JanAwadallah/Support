"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function RegisterForm() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session?.user) {
    router.replace("/");
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required!!");
      return;
    }
    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        res.json().then((data) => {
          setError(data.message);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen w-screen">
      <div
        style={{
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          width: "90vw",
          maxWidth: "500px",
        }}
        className="shadow-lg p-5 rounded-lg border-t-4 border-green-400 "
      >
        <h1 className="text-xl font-bold my-4">Register</h1>
{/*         <h2>Temporarily unavailable</h2> */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3  items-center"
        >
          <input
            pattern="[a-zA-Z ]{3,20}"
            title="Name must be 3-20 characters long and can only contain letters"
            required
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          />
          <input
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
            required
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />

          <input
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
            required
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-green-600 text-white font-bold rounded-sm cursor-pointer px-6 py-2">
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/"}>
            Already registered? <span className=" underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
