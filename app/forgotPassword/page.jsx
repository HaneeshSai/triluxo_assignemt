"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineMail } from "react-icons/ai";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const sendEmail = () => {
    sendPasswordResetEmail(auth, email)
      .then(
        (a) =>
          toast.success(
            "password reset email has been succesfully sent, Please check your email"
          ),
        push("/")
      )
      .catch((error) => console.log(error));
  };
  return (
    <div className="w-full h-full mx-4 flex justify-center items-center">
      <Toaster />
      <div className="text-2xl items-center  flex flex-col gap-8 Shadow px-3 py-4">
        <AiOutlineMail size={60} />
        Please Enter the Email connected to your account
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          name=""
          id=""
          className="px-1.5 outline-none py-0.5"
        />
        <button
          onClick={sendEmail}
          className="bg-red-500 px-2 py-1 rounded-md text-white hover:bg-red-700 "
        >
          Send Reset Password Link
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
