"use client";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { auth } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpin from "react-loading-spin";

const Signup = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [togglePassword, setTogglePassword] = useState("password");
  const [isloading, setIsLoading] = useState(false);

  const SubmitSignUp = async (e) => {
    e.preventDefault();
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Invali Email Please re-enter your email");
    } else if (
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
    ) {
      toast(
        "Invalid Password \n1) A password must contain atleast 8 characters\n2) A password must contain atleast one UPPERCASE letter and a lowercase letter\n3) A password must contain atleast one number"
      );
    } else if (displayName.length < 4) {
      toast.error("display name should be atleast 4 characters");
    } else {
      setIsLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCreds) => {
          const user = userCreds.user;
          await updateProfile(user, {
            displayName: displayName,
          }).catch((error) => console.log);
          toast.success("Account Created Successfully. Redirecting...");
          push("/app/user");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            setIsLoading(false);
            toast.error(
              "This email already Exists Please use a different email"
            );
          }
        });
    }
  };

  return (
    <>
      <Toaster />
      {isloading ? (
        <div className="absolute top-0 w-screen flex justify-center">
          <LoadingSpin />{" "}
        </div>
      ) : null}
      <div className="h-screen flex items-center justify-center w-screen">
        <div className="flex Shadow md:flex-row flex-col item-center">
          <form
            action=""
            onSubmit={SubmitSignUp}
            className="flex flex-1 flex-col px-3 items-start m-3 gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="Email"
                className="text-xl px-1.5 outline-none my-2"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="">Display Name</label>
              <input
                type="text"
                placeholder="Display Name"
                className="text-xl px-1.5 outline-none mt-2"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Password</label>
              <div className="flex items-center gap-3">
                <input
                  type={togglePassword}
                  placeholder="Password"
                  className="text-xl px-1.5 outline-none my-2"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <div
                  onClick={() => {
                    if (togglePassword === "text")
                      setTogglePassword("password");
                    else setTogglePassword("text");
                  }}
                  className="cursor-pointer"
                >
                  {togglePassword === "password" ? (
                    <BsEye size={20} />
                  ) : (
                    <BsEyeSlash size={20} />
                  )}
                </div>
              </div>
            </div>
            <button className="bg-sky-400 w-48 px-2 rounded-md font-medium text-[#ffffff] py-1.5 hover:bg-sky-500">
              Sign Up
            </button>
            <p className="">
              Already have an account?{" "}
              <Link href="/" className="text-sky-700 underline cursor-pointer">
                Login
              </Link>
            </p>
          </form>
          <div className="flex-1 p-8 text-center flex flex-col  justify-center bg-sky-400">
            <h1 className="text-3xl tracking-wide font-medium">
              Hi Friend....
            </h1>
            <p>Create an account to use the Todo App</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
