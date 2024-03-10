import z from "zod";

export const signupInput = z.object({    // 4 variables that backend will need to create a new user
    username: z.string().email(),    
    password: z.string().min(6),
    name: z.string().optional(),
});


export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
});

export const createBlogInput = z.object({
    title: z.string(),
    content: z.string()
})

export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>; 
export type CreateBlogInput = z.infer<typeof createBlogInput>; // infer is a function that will take the type of the zod schema, frontend will need
export type UpdateBlogInput = z.infer<typeof updateBlogInput>; 

