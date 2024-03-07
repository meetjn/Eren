import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput } from "@meetjain/eren-commons";

export const userRouter = new Hono<{
    Bindings: {                    // Define the environment variables
        DATABASE_URL: string;      // Define the DATABASE_URL environment variable
        JWT_SECRET: string;        // Define the JWT_SECRET environment variable
    }
}>();


// Define routes
userRouter.post('/signup', async (c) => {
	const body = await c.req.json();
	const {success} = signupInput.safeParse(body);  // validate the input (frontend will need this to validate the input before sending it to backend)
	if (!success){
		c.status(411);
		return c.json({
			message: "Invalid input. Please try again."
		})
	}
	const prisma = new PrismaClient({
	datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())  // Initialize Prisma Client with the Accelerate extension. mandatory thing. 

	try{  // try catch block to handle errors
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name,
			}
		})
		const jwt = await sign ({
			id: user.id,
		}, c.env.JWT_SECRET);

		return c.text(jwt)
	} catch (e){
		c.status(411)
		return c.text('Invalid input. Please try again.')
	}
})

userRouter.post('/signin', async (c) => {
	const body = await c.req.json();
	const {success} = signupInput.safeParse(body);  // validate the input (frontend will need this to validate the input before sending it to backend)
	if (!success){
		c.status(411);
		return c.json({
			message: "Invalid input. Please try again."
		})
	}
	const prisma = new PrismaClient({
	datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())  // Initialize Prisma Client with the Accelerate extension. mandatory thing. 

	try{  // try catch block to handle errors
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
				password: body.password,
			}
		})
		if (!user){
			c.status(403);  // unauthorized
			return c.json({
				msg: "Invalid credentials. Please try again."
			})
		}
		const jwt = await sign ({
			id: user.id,
		}, c.env.JWT_SECRET);

		return c.text(jwt)
	} catch (e){
		c.status(411)
		return c.text('Invalid input. Please try again.')
	}
})