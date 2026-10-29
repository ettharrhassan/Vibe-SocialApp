import { useForm } from "react-hook-form";
import "../../schemas/signup.schema";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Hearts } from "react-loader-spinner";
import type { loginDataType } from "./login.types";
import { loginSchema } from "../../schemas/login.schema";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthCreatedContext } from "../../context/AuthContext";

export default function Login() {
  const { addDataToToken } = useContext(AuthCreatedContext);

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);

  let nav = useNavigate();

  async function myHandleSubmit(values: loginDataType) {
    if (loading == true) {
      return;
    }
    try {
      setLoading(true);
      let { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
        
      );
      
  
      toast.success(data.message);
      addDataToToken(data.data.token, data.data.user);
      nav("/home");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.danger(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
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
            <nav
              aria-label="Account access"
              className="mb-4 flex w-full rounded-2xl border border-lightPink bg-white/80 p-1.5 shadow-sm"
            >
              <NavLink
                to="/login"
                end
                className={({ isActive }) =>
                  `flex-1 rounded-xl px-4 py-3 text-center font-semibold transition-colors ${
                    isActive
                      ? "bg-burgundy text-white shadow-sm"
                      : "text-burgundy hover:bg-softRose"
                  }`
                }
              >
                LogIn
              </NavLink>
              <NavLink
                to="/signup"
                end
                className={({ isActive }) =>
                  `flex-1 rounded-xl px-4 py-3 text-center font-semibold transition-colors ${
                    isActive
                      ? "bg-burgundy text-white shadow-sm"
                      : "text-burgundy hover:bg-softRose"
                  }`
                }
              >
                SignUp
              </NavLink>
            </nav>
            <form
              onSubmit={handleSubmit(myHandleSubmit)}
              className="rounded-2xl border border-lightPink bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="my-5">
                <h3 className="mt-1 text-3xl font-bold bg-linear-to-r from-burgundy via-primePink to-lightPink bg-clip-text text-transparent">
                  Login To Your Account
                </h3>
                <p className="mt-1 text-sm font-bold text-darkText">
                  It is quick and easy.
                </p>
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Your Email Address"
                  {...register("email")}
                  className="my-2 focus:border-primePink focus:outline-none focus:ring-0 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink "
                />
                {formState.errors.email && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.email?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  {...register("password")}
                  id="password"
                  className="my-2 border border-lightPink bg-softRose shadow p-3 rounded-xl placeholder:text-lightPink focus:border-primePink focus:outline-none focus:ring-0"
                />
                {formState.errors.password && (
                  <p className="text-burgundy bg-lightPink border-deep border p-2 rounded-2xl font-medium">
                    {formState.errors?.password?.message}
                  </p>
                )}
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl my-5 py-3 cursor-pointer text-base font-extrabold text-softRose transition disabled:opacity-60 bg-burgundy hover:bg-deep flex items-center justify-center">
                {loading ? (
                  <Hearts
                    height="25"
                    width="100"
                    color="#fff7fe"
                    ariaLabel="hearts-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
