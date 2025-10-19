import { Prisma, Users } from "@prisma/client";
import { RegisterUserInput } from "./types/auth.types";
import prisma from "../prisma/prisma";
import * as bcrypt from 'bcryptjs';

export class AuthService {
    
    async register(data: RegisterUserInput): Promise<Users> {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const newUser = await prisma.users.create({
                data: {
                    userName: data.userName,
                    userEmail: data.userEmail,
                    password: hashedPassword
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

