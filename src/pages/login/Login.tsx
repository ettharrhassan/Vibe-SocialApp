import { useForm } from "react-hook-form";
import "../../schemas/signup.schema";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Hearts } from "react-loader-spinner";
import type { loginDataType } from "./login.types";
import { loginSchema } from "../../schemas/login.schema";

export default function Login() {
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);

  console.log(loading, setLoading);

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
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.danger(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }

    console.log(values);
  }

  return (
    <>
      <div className="bg-softRose min-h-screen px-4 py-8 sm:py-12 lg:flex lg:items-center">
        <div className="container flex flex-wrap justify-around">
          <div className="md:w-1/3">
            <form
              onSubmit={handleSubmit(myHandleSubmit)}
              className=" mt-6 rounded-2xl border border-lightPink bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
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
