import { Prisma } from "@prisma/client";
import { RegisterUserInput } from "./types/auth.types";
import { PrismaClient } from "@prisma/client/extension";

export class AuthService {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    
    async register(data: RegisterUserInput): Promise<void> {
        try {
            await this.prisma.user.create({
                data: {
                    userName: data.userName,
                    userEmail: data.userEmail
                }
            }) 
        } catch(error: any) {
            throw new Error(`Error registering user ${error.message}`);
        }
    }
}