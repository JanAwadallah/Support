import React from "react";

const UserInfo = () => {
  return (
    <div className="grid place-items-center h-screen">
      <div className=" shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6">
        <div>
          Name:{" "}
          <span className=" text-xl text-blue-700 font-bold">
            Jan Awadallah
          </span>{" "}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
