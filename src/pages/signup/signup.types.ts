









import * as zod from "zod"
import type { schema } from "../../schemas/signup.schema"

export  type signUpDataType = zod.infer<  typeof schema >
