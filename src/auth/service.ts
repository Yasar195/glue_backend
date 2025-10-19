import { Prisma, Users } from "@prisma/client";
import { LoginUserInput, RegisterUserInput } from "./types/auth.types";
import prisma from "../prisma/prisma";
import * as bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { Auth } from "../common/auth.class";
import { TokenPairResponse } from "../common/types";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export class AuthService {

    private authFunctions: Auth;

    constructor() {
        this.authFunctions = new Auth();
    }
    
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

    async login(data: LoginUserInput): Promise<TokenPairResponse> {
        try {
            const user = await prisma.users.findUnique({
                where: { userEmail: data.userEmail },
            });
    
            if (!user) {
                throw new Error("Invalid email or password");
            }
    
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
    
            const jwtSecret = process.env.JWT_SECRET;
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    
            if (!jwtSecret || !refreshTokenSecret) {
                console.error("JWT_SECRET or REFRESH_TOKEN_SECRET not set in environment variables.");
                throw new Error("Server configuration error: missing JWT secrets.");
            }
    
            const payload = { sub: user.id, email: user.userEmail, exp: Math.floor(Date.now() / 1000) + (60 * 15) };
            const tokens = await this.authFunctions.CreateTokenPairs(payload);
    
            return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };    
        } catch(error: any) {
            throw new Error(`Error Loging in user: ${error.message}`);
        }
    }

    authMiddleware = async (c: Context, next: Next) => {
        const authHeader = c.req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new HTTPException(401, { message: 'Missing or invalid authorization header' });
        }
      
        const token = authHeader.substring(7);
        
        try {
          const secret = process.env.JWT_SECRET || 'your-secret-key';
          const payload = await verify(token, secret) as JWTPayload;
          
          if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new HTTPException(401, { message: 'Token expired' });
          }
          
          c.set('user', payload);
          
          await next();
        } catch (err) {
          throw new HTTPException(401, { message: 'Invalid or expired token' });
        }
      };
}

