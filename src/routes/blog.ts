import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { verify } from 'hono/jwt';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const user = verify(authHeader, c.env.JWT_SECRET); 
    if (!user) {
        c.status(401);
        return c.json({
            message: "Unauthorized",
        });
    }
   await next();
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());  
    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: parseInt(authorId)
        }
    });

    return c.json({
        id: blog.id,
    });
});

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.json({
        id: blog.id,
    });
});

blogRouter.get('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());  

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: body.id
            },
        });

        if (!blog) {
            c.status(404);
            return c.json({
                message: 'Blog not found.',
            });
        }

        return c.json(blog);
    } catch (e) {
        console.error('Error:', e);
        c.status(500);
        return c.json({
            message: 'Internal server error.',
        });
    }
});


//todo: add pagination
blogRouter.get('/bulk', async (c) => { const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
    const blogs = await prisma.post.findFirst();
    return c.json({
        blogs
    });
});

