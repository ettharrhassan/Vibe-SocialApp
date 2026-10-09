import * as zod from "zod";

  export let loginSchema = zod.object({

    email: zod.email("Email Is Required"),

    password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"Password Is Required"),
    
});

