import { decode, sign, verify } from 'hono/jwt'
import { TokenPairResponse, TokenPayload } from './types';

export class Auth {
    async CreateTokenPairs(payload: any): Promise<TokenPairResponse> {
        const accessToken = await sign(
            payload,
            process.env.JWT_SECRET || '',
        );

        const refreshToken = await sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET || ''
        );

        const response: TokenPairResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        
        return response;
    }
}