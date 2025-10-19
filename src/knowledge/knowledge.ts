import { Context, Hono } from "hono";
import { KnowledgeBaseInput } from "./types/knowledge.types";
import { ApiResponse, Payload } from "../common/types";
import { z } from '@hono/zod-openapi';
import prisma from "../prisma/prisma";
import { KnowledgeService } from "./service";
import { AuthService } from "../auth/service";

export const knowledge = new Hono();
 
class KnowledgeRoute {

    private knowledgeService: KnowledgeService;
    
    constructor() {
        this.knowledgeService = new KnowledgeService();
    }

    async createKnowledgeBase(c: Context){
        try {
            let content = await c.req.json(); 

            const body: KnowledgeBaseInput = KnowledgeBaseInput.parse(content);

            await this.knowledgeService.createKnowledgeBase(c, body);

            const response: ApiResponse<null> = {
                data: null,
                error: null,
                message: "Knowledge base created successfully",
                statusCode: 201, 
                success: true
            }  
            
            return c.json(response, 201);
            
        } catch(error: any) {
            const response: ApiResponse<null> = {
                data: null,
                error: error.message,
                message: "An error occurred during knowledge base creation",
                statusCode: 500,
                success: false
            }
            return c.json(response, 500);
        }
    }

}

const KnowledgeBaseInput = z.object({
    title: z
      .string({ message: "Title is required" }),
    content: z
      .string({ message: "Content is required" })
      .min(1, { message: "Password cannot be empty" }),
});

const knowledgeRouter = new KnowledgeRoute();
const auth = new AuthService();

knowledge.post("/", auth.authMiddleware,(c) => knowledgeRouter.createKnowledgeBase(c));
