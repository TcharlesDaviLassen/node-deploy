import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();


app.get('/users', async () => {
    const users = await prisma.user.findMany();

    return { users }
});


app.post('/users', async (req, reply) => {
    const createUserShema = z.object({
        name: z.string(),
        email: z.string().email(),
    });


    const { name, email } = createUserShema.parse(req.body);

    const data = await prisma.user.create({
        data: {
            name,
            email
        }
    });

    return reply.send({ message: `CREATED `, data });
});


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log('listening on port ', `http://localhost:${process.env.PORT || 3333}`);
});