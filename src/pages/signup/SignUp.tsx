import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { signUpDataType } from "./signup.types";

export default function SignUp() {
  const { handleSubmit, register, formState, setError, getValues, watch } =
    useForm({
      defaultValues: {
        name: "",
        username: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        password: "",
        rePassword: "",
      },
      mode: "onBlur",
    });

  // console.log(formState.errors);

  function myHandleSubmit(values: signUpDataType) {
    // if (values.rePassword !== values.password) {
    //   setError("rePassword",{message:"Password and RePassword do not match."})
    //   return
    // }

    console.log(values);
  }

  return (
    <>
      <div className="bg-softRose min-h-screen px-4 py-8 sm:py-12 lg:flex lg:items-center">
        <div className="container flex flex-wrap justify-around">
          <div className="md:w-1/3">
            <h1 className="bg-linear-to-r from-burgundy via-primePink to-lightPink bg-clip-text text-transparent hidden text-5xl font-extrabold tracking-tight sm:text-6xl lg:block">
              Vibe
            </h1>
            <p className="hidden mt-4 text-2xl font-medium leading-snug text-darkText lg:block">
              Connect with friends and the world around you on Vibe.
            </p>
            <div className="mt-6 rounded-2xl border border-lightPink bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <p className="bg-linear-to-r from-burgundy via-primePink to-lightPink bg-clip-text text-transparent text-5xl font-bold tracking-tight">
                About Vibe
              </p>
              <p className="mt-1 text-sm font-bold text-darkText">
                Born in <span className="text-burgundy">Egypt</span>, Made for
                Everyone
              </p>
              <p className="mt-1 text-sm font-bold text-darkText">
                Where Ideas, Moments & People Come Together
              </p>
              <p className="mt-2 text-sm leading-relaxed text-lightText">
                Vibe is a social media app made to bring people together and
                make sharing feel more real. Share your moments, thoughts, and
                achievements, connect with people who share your interests,
                discover new content, and be part of a community where everyone
                has something to say. With Vibe, it’s not just about likes and
                follows. it’s about sharing, discovering, and creating
                meaningful connections.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-lightPink bg-softRose px-3 py-2">
                  <p className="text-base font-extrabold text-deep">2026</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-burgundy">
                    Founded
                  </p>
                </div>
                <div className="rounded-xl border border-lightPink bg-softRose px-3 py-2">
                  <p className="text-base font-extrabold text-deep">100+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-burgundy">
                    COMMUNITIES
                  </p>
                </div>
                <div className="rounded-xl border border-lightPink bg-softRose px-3 py-2">
                  <p className="text-base font-extrabold text-deep">50K+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-burgundy">
                    Users
                  </p>
                </div>
                <div className="rounded-xl border border-lightPink bg-softRose px-3 py-2">
                  <p className="text-base font-extrabold text-deep">24/7</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-burgundy">
                    support
                  </p>
                </div>
                <div className="rounded-xl border border-lightPink bg-softRose px-3 py-2">
                  <p className="text-base font-extrabold text-deep">10K+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-burgundy">
                    posts
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <form
              onSubmit={handleSubmit(myHandleSubmit)}
              className=" mt-6 rounded-2xl border border-lightPink bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="my-5">
                <h3 className="mt-1 text-3xl font-bold bg-linear-to-r from-burgundy via-primePink to-lightPink bg-clip-text text-transparent">
                  Create a new account
                </h3>
                <p className="mt-1 text-sm font-bold text-darkText">
                  It is quick and easy.
                </p>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  id="name"
                  className="focus:border-primePink focus:outline-none focus:ring-0 my-2 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink "
                  {...register("name", {
                    required: { value: true, message: "Name Is Required" },
                    minLength: {
                      value: 3,
                      message: "Name Must Be At Least 3 Letters",
                    },
                  })}
                />

                {formState.errors.name && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.name?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="userName">UserName</label>
                <input
                  type="text"
                  id="userName"
                  placeholder="Enter A UserName"
                  {...register("username", {
                    required: { value: true, message: "UserName Is Required" },
                    minLength: {
                      value: 5,
                      message: "UserName Must Be At Least 5 Letters",
                    },
                  })}
                  className="my-2 border border-lightPink focus:border-primePink focus:outline-none focus:ring-0 bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink "
                />
                {formState.errors.username && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.username?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Your Email Address"
                  {...register("email", {
                    required: { value: true, message: "Email Is Required" },
                    pattern: {
                      value:
                        /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                  className="my-2 focus:border-primePink focus:outline-none focus:ring-0 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink "
                />
                {formState.errors.email && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.email?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="dateOfBirth">Date Of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  placeholder="Select Your Date Of Birth"
                  {...register("dateOfBirth", {
                    required: {
                      value: true,
                      message: "Please Enter Your Date Of Birth",
                    },
                    valueAsDate: true,
                    validate: function (value) {
                      const now = new Date();
                      const userAge = now.getFullYear() - value.getFullYear();
                      console.log(userAge);
                      if (userAge > 18) {
                        return true;
                      } else {
                        return "You Must Be At Least 18 Years Old.";
                      }
                    },
                  })}
                  className="my-2 border border-lightPink bg-softRose shadow p-3 rounded-xl focus:border-primePink focus:outline-none focus:ring-0"
                />
                {formState.errors.dateOfBirth && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.dateOfBirth?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="gender" className="mb-2.5">
                  Gender
                </label>
                <div className="flex gap-3 items-center">
                  <label htmlFor="male">Male</label>
                  <input
                    type="radio"
                    value="male"
                    {...register("gender", {
                      required: { value: true, message: "Choose Your Gender" },
                    })}
                    id="male"
                    className="my-2 size-4 shrink-0 appearance-none rounded-full
           border-2 border-lightPink bg-softRose 
           checked:border-softRose checked:bg-primePink
           focus:outline-none focus:ring-2 focus:ring-lightPink"
                  />
                  <label htmlFor="female">Female</label>
                  <input
                    type="radio"
                    value="female"
                    {...register("gender", {
                      required: { value: true, message: "Choose Your Gender" },
                    })}
                    id="female"
                    className="my-2 size-4 shrink-0 appearance-none rounded-full
           border-2 border-lightPink bg-softRose 
           checked:border-softRose checked:bg-primePink
           focus:outline-none focus:ring-2 focus:ring-lightPink"
                  />
                </div>
                {formState.errors.gender && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.gender?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: { value: true, message: "Password Is Required" },
                    pattern: {
                      value:
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                      message:
                        "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
                    },
                  })}
                  id="password"
                  className="my-2 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink focus:border-primePink focus:outline-none focus:ring-0"
                />
                {formState.errors.password && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.password?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="repassword">rePassword</label>
                <input
                  type="password"
                  id="repassword"
                  placeholder="Re-enter your password"
                  {...register("rePassword", {
                    required: {
                      value: true,
                      message: "rePassword Is Required",
                    },
                    pattern: {
                      value:
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                      message:
                        "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
                    },
                    validate: function (value) {
                      if (value == watch("password")) {
                        return true;
                      } else {
                        return "Password and RePassword do not match.";
                      }
                    },
                  })}
                  className="my-2 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink focus:border-primePink focus:outline-none focus:ring-0"
                />
                {formState.errors.rePassword && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.rePassword?.message}
                  </p>
                )}
              </div>
              <button className="w-full rounded-xl my-5 py-3 cursor-pointer text-base font-extrabold text-white transition disabled:opacity-60 bg-burgundy hover:bg-deep">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
