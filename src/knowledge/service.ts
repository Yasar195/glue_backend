import { Context } from "hono";
import prisma from "../prisma/prisma";
import { KnowledgeBaseInput } from "./types/knowledge.types";
import { Payload } from "../common/types";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export class KnowledgeService {
    async createKnowledgeBase(c: Context, data: KnowledgeBaseInput): Promise<void> {
        try {

            const user: Payload = c.get("user");

            await prisma.$transaction([
                prisma.knowledge.create({
                    data:{
                        title: data.title,
                        content: data.content,
                        userId: user.sub,
                    }
                })
            ])

            const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });

            const namespace = pc.index(process.env.PINECONE_INDEX || "", process.env.PINECONE_INDEX_HOST).namespace(user.email);

            await this.knowledgeUpsert(namespace, data);

        } catch(error: any) {
            throw new Error(`${error.message}`);
        }
    }

    async geminiEmbeddings(text: string) {

        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
    
        const response = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: text,
        });

        return response.embeddings? response.embeddings[0].values: [];
    }

    async getGroqChatCompletion(query: string, context: string) {
        try {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            return groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant. Answer the user's question based on the following context information.
                
                        Context:
                        ${context}
                
                        Question: ${query}
                
                        Answer: Provide a clear and concise answer based only on the information in the context. If the context doesn't contain enough information to answer the question, say so.`,
                    },
                    {
                        role: "user",
                        content: query,
                    }
                ],
                model: "openai/gpt-oss-20b",
            });
        } catch(error: any) {
            throw new Error(`${error.message}`);
        }
    }

    async knowledgeUpsert(namespace: Index,data: KnowledgeBaseInput) {
        try {
            const embedding = await this.geminiEmbeddings(data.content);

            await namespace.upsert([{
                id: `kb-${Date.now()}`,
                values: embedding,
                metadata: {
                    title: data.title,
                }
            }])   
        } catch(error: any) {
            throw new Error(`${error.message}`);
        }
    }
}