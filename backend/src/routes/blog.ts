import { createBlogInput, updateBlogInput } from '@meetjain/eren-commons';
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

blogRouter.use("/*", async (c, next)=>{
    const authHeader = c.req.header("authorization")|| "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);  
    if (user) {
        c.set("userId", user.id);
        await next();
    }
    else {
        c.status(401);
        return c.json({
            message: "you are not logged in"
        });
    }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in."
        })
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Invalid input. Please try again."
        })
    }
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
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Invalid input. Please try again."
        });
    }
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

//todo: add pagination
blogRouter.get('/bulk', async (c) => { const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
    const blogs = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        blogs
    });
});

blogRouter.get('/:id', async (c) => {
    const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());  

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true,
                    }
                }
            }
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




