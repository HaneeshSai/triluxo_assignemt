"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpin from "react-loading-spin";

export default function Home() {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [togglePassword, setTogglePassword] = useState("password");
  const [isloading, setIsLoading] = useState(false);

  const SubmitLogin = async (e) => {
    e.preventDefault();
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Invali Email Please re-enter your email");
    } else if (
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
    ) {
      toast(
        "Invalid Password \n1) A password must contain atleast 8 characters\n2) A password must contain atleast one UPPERCASE letter and a lowercase letter\n3) A password must contain atleast one number"
      );
    } else {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCreds) => {
          const user = userCreds.user;
          toast.success("Login Success. Redirecting... ");
          push("/app/user");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-login-credentials") {
            setIsLoading(false);
            toast.error("Invalid Login Credentials");
          }
        });
    }
  };
  return (
    <main className="w-screen px-2">
      {isloading ? (
        <div className="absolute top-0 w-screen flex justify-center">
          <LoadingSpin />{" "}
        </div>
      ) : null}
      <Toaster />
      <div className="h-screen flex items-center justify-center w-full">
        <div className="flex md:flex-row flex-col Shadow item-center">
          <div className="flex-1 p-8 text-center flex flex-col  justify-center bg-sky-400">
            <h1 className="text-3xl tracking-wide font-medium">
              Welcome Back...
            </h1>
            <p>Enter Your credentials to manage your Todos</p>
          </div>

          <form
            action=""
            onSubmit={SubmitLogin}
            className="flex flex-1 flex-col px-3 items-start m-3 gap-5"
          >
            <div className="flex flex-col">
              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="text-xl px-1.5 outline-none my-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={togglePassword}
                  placeholder="Password"
                  className="text-xl px-1.5 outline-none my-2"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    if (togglePassword === "text")
                      setTogglePassword("password");
                    else setTogglePassword("text");
                  }}
                >
                  {togglePassword === "password" ? (
                    <BsEye size={20} />
                  ) : (
                    <BsEyeSlash size={20} />
                  )}
                </div>
              </div>
              <p className="text-sky-900 underline cursor-pointer">
                forgot password?
              </p>
            </div>

            <button className="bg-sky-400 w-24 px-2 rounded-md font-medium text-[#ffffff] py-1.5 hover:bg-sky-500">
              Login
            </button>
            <p className="">
              Don`&apos;t have an account?{" "}
              <Link
                href="signup"
                className="text-sky-700 underline cursor-pointer"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
