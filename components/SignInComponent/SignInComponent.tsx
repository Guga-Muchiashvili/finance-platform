"use client";
import React, { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import signIn from "@/actions/signIn/signIn";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInComponent = () => {
  const [type, setType] = useState("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const isSignedIn = signIn(password);

    console.log(isSignedIn);

    if (!isSignedIn) {
      setError(true);
      return;
    }

    setPassword("");
    toast.success("Signed in", {
      description: "Signed in successfully",
    });

    router.push("/Dashboard");
  };

  return (
    <div className="w-full h-screen text-blue-600 flex justify-center items-center">
      <div className="min-w-[25vw] flex flex-col items-center border-[1px] border-blue-600 p-3 py-8 px-14 gap-3 rounded-2xl">
        <MdAdminPanelSettings className="text-[120px] text-white bg-blue-600 rounded-full" />
        <h1 className="text-4xl mt-2">Admin register</h1>
        <form
          onSubmit={submit}
          className="w-full flex items-center justify-center gap-6 mt-6 flex-col"
        >
          <div className="relative w-full">
            <input
              type={type}
              name="password"
              placeholder="Enter password"
              value={password}
              className={`text-sm bg-transparent w-full border-b-[1px] sm:text-base py-3 outline-none block ease-in-out duration-300 ${
                error
                  ? "border-b-red-500 text-red-500"
                  : "border-b-blue-600 text-blue-600"
              }`}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 focus:outline-none"
            >
              {type === "password" ? (
                <FiEye
                  className={`text-xl text-blue-600 ${
                    error ? "text-red-500" : "text-blue-600"
                  }`}
                />
              ) : (
                <FiEyeOff
                  className={`text-xl text-blue-600 ${
                    error ? "text-red-500" : "text-blue-600"
                  }`}
                />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-600 w-full h-12 rounded-xl"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInComponent;
