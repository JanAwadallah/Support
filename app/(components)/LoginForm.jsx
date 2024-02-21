"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { CirclesWithBar } from "react-loader-spinner";
import { redirect } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  if (session?.user) {
    router.replace("/");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authorised, setAuthorised] = useState(false);

  useEffect(() => {
    if (authorised) {
      router.replace("/");
    }
  }, [authorised]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res.ok) {
        setAuthorised(true);
        setIsLoading(false);
        router.push("/");
      } else if (res.error) {
        setError(res.error);
        return;
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen ">
      <div
        style={{
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          width: "90vw",
          maxWidth: "500px",
        }}
        className=" justify-center shadow-lg p-5 rounded-lg border-t-4 border-green-400 "
      >
        {isLoading ? (
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <>
            <h1 className="text-xl font-bold my-4">Login</h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 items-center"
            >
              <input
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
                required
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                required
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-green-600 text-white font-bold rounded-sm cursor-pointer px-6 py-2"
              >
                Login
              </button>
              {error && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {error}
                </div>
              )}
              <Link className="text-sm mt-3 text-right" href={"/register"}>
                <p>Do not have an account?</p>{" "}
                <span className=" underline">Register</span>
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
