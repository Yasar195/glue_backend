import { Hono } from "hono";
import { ApiResponse, MessageResponse } from "../common/types";
import { AuthService } from "./service";
import { Context } from "hono";
import { Auth } from "../common/auth.class";
import { RegisterUserInput } from "./types/auth.types";
import { z } from '@hono/zod-openapi'

export const auth = new Hono();

class AuthRouter  {

    private AuthService: AuthService;
    private AuthClass: Auth;

    constructor() {
        this.AuthService = new AuthService();
        this.AuthClass = new Auth();
    }

    async register(c: Context) {
        try {            
            let content = await c.req.json(); 

            const body: RegisterUserInput = userRegisterInput.parse(content);

            await this.AuthService.register(body);

            const response: ApiResponse<MessageResponse> = {
                data: {
                    message: "User registered successfully"
                },
                error: null,
                message: "user registration successfull",
                statusCode: 201, 
                success: true
            }  
            
            return c.json(response, 201);
        } catch (error: any) {
            const response: ApiResponse<null> = {
                data: null,
                error: error.message,
                message: "An error occurred during user registration",
                statusCode: 500,
                success: false
            }
            return c.json(response, 500);
        }
    }
}

const userRegisterInput = z.object({
    userName: z
      .string({ message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(30, { message: "Username must not exceed 30 characters" }),
    userEmail: z
      .string({ message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

const authRouter = new AuthRouter();

auth.post('/register', (c) => authRouter.register(c))
  