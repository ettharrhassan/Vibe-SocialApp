import * as zod from "zod";

  export let schema = zod.object({
    name: zod.string().min(3, "Name Must Be At Least 3 Letters").max(30).nonempty("Name Is Required"),
    username: zod.string().min(5,"UserName Must Be At Least 5 Letters").max(20).optional(),
    email: zod.email("Email Is Required"),
    dateOfBirth: zod.coerce.date(),
    gender: zod.enum(["male", "female"]),
    password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/),
    rePassword: zod.string(),
  }).refine(function(value){
    return value.rePassword===value.password
  },{
    path:["rePassword"],
    error:"Password and RePassword do not match."
  });

