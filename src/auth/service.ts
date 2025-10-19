import { Prisma, Users } from "@prisma/client";
import { RegisterUserInput } from "./types/auth.types";
import prisma from "../prisma/prisma";

export class AuthService {
    
    async register(data: RegisterUserInput): Promise<Users> {
        try {
            const newUser = await prisma.users.create({
                data: {
                    userName: data.userName,
                    userEmail: data.userEmail
                }
            });
            return newUser;
        } catch(error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error(`A user with this email or username already exists.`);
            }
            throw new Error(`Error registering user: ${error.message}`);
        }
    }
}

