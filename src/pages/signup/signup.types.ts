// export interface signUpDataType {
//   name: string;
//   username: string | undefined;
//   email: string;
//   dateOfBirth: Date ;
//   gender: "male" | "female";
//   password: string;
//   rePassword: string;
// }

import * as zod from "zod"
import type { schema } from "../../schemas/signup.schema"

export  type signUpDataType = zod.infer<  typeof schema >