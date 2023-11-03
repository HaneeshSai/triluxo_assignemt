"use client";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { uid } from "uid";
import { db, auth } from "../../firebase";
import { onValue, ref, remove, set, update } from "firebase/database";
import { RiDeleteBin2Line } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingSpin from "react-loading-spin";

const HomePage = () => {
  const { push } = useRouter();
  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState("");
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setTodos([]);
            Object.values(data).map((todo) => {
              setTodos((old) => [...old, todo]);
            });
          }
        });
      }
    });
  }, []);

  const deleteTodo = (uid) => {
    remove(ref(db, `${auth.currentUser.uid}/${uid}`));
  };

  const updateTodo = (e) => {
    if (e.status === "todo") {
      update(ref(db, `${auth.currentUser.uid}/${e.uid}`), {
        uid: e.uid,
        description: e.description,
        status: "finished",
        timestamp: Date.now(),
      });
    } else if (e.status === "finished") {
      update(ref(db, `${auth.currentUser.uid}/${e.uid}`), {
        uid: e.uid,
        description: e.description,
        status: "todo",
        timestamp: Date.now(),
      });
    }
  };

  const signout = () => {
    setIsLoading(true);
    signOut(auth).then(() => {
      push("/");
    });
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      let uuid = uid();
      let todo = {
        uid: uuid,
        description: currentTodo,
        status: "todo",
        timestamp: Date.now(),
      };
      set(ref(db, `${auth.currentUser.uid}/${uuid}`), todo)
        .then(setCurrentTodo(""))
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <div className=" w-screen flex flex-col items-center md:px-32 px-2 py-12">
        {isloading ? (
          <div className="absolute top-0 w-screen flex justify-center">
            <LoadingSpin />{" "}
          </div>
        ) : null}
        <div className="flex justify-between w-full">
          <p className="text-xl pb-2">
            Welcome back {auth.currentUser?.displayName}
          </p>
          <button
            onClick={signout}
            className="border-2 px-2 py-1 border-sky-800 hover:bg-sky-800 hover:text-white rounded-md"
          >
            Sign-out
          </button>
        </div>
        <h1 className="font-bold text-4xl text-sky-800 tracking-wide">
          Todo List
        </h1>
        <form className="md:w-3/4 w-[90%] mx-2 md:mx-0 my-5 flex gap-5 items-center">
          <input
            type="text"
            placeholder="Add a Todo..."
            value={currentTodo}
            onChange={(e) => setCurrentTodo(e.target.value)}
            className="text-xl outline-none rounded-3xl w-full px-3 py-2"
          />
          <button
            onClick={addTodo}
            className="bg-sky-800 p-1.5 flex-1 rounded-full cursor-pointer hover:bg-sky-700"
          >
            <AiOutlinePlus size={25} color="white" />
          </button>
        </form>
        <div className="flex-1 flex w-3/4 flex-col items-center Shadow rounded-md ">
          <h1 className="text-2xl w-[50%] text-center my-2  text-sky-900 font-bold border-b border-sky-800">
            Todo
          </h1>
          <div className=" w-[90%] text-center mx-3">
            {todos.length < 1 ? (
              <p>No todos</p>
            ) : (
              <div className="divide-y-2">
                {todos.map((e, i) => (
                  <div
                    key={i}
                    className="flex gap-3 justify-between items-baseline w-full my-2 pt-2"
                  >
                    <h1
                      className={
                        e.status === "finished"
                          ? "md:text-xl text-[13px] line-through font-medium text-start truncate flex-1"
                          : "md:text-xl text-[13px] font-medium text-start truncate flex-1"
                      }
                    >
                      {e.description}
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] flex-2 text-start">
                        {`${new Date(e.timestamp).getDate()}/${
                          new Date(e.timestamp).getMonth() + 1
                        }/${new Date(e.timestamp).getFullYear()} - ${new Date(
                          e.timestamp
                        ).getHours()}:${new Date(e.timestamp).getMinutes()}`}
                      </p>
                      <input
                        type="checkbox"
                        className="pb-2 cursor-pointer"
                        onChange={() => updateTodo(e)}
                        checked={e.status === "finished"}
                      />

                      <RiDeleteBin2Line
                        size={25}
                        color="red"
                        className="pb-2 cursor-pointer"
                        onClick={() => deleteTodo(e.uid, e.description)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
