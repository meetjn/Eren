import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors'



const app = new Hono<{
	Bindings: {                  // Define the environment variables
		DATABASE_URL: string;    // Define the DATABASE_URL environment variable
		JWT_SECRET: string;      // Define the JWT_SECRET environment variable
	}
}>();

app.use('/*', cors());  // Enable CORS for all routes under /api cors middleware frontend will be able to talk with the backend
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

