import { decode, sign, verify } from 'hono/jwt'
import { TokenPairResponse, TokenPayload } from './types';

export class Auth {
    async CreateTokenPairs(payload: TokenPayload): Promise<TokenPairResponse> {
        const accessToken = await sign(
            {
                userId: payload.userId,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            'your-secret-key',
        );

        const refreshToken = await sign(
            {
                userId: payload.userId,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            },
            'your-refresh-secret-key'
        );

        const response: TokenPairResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        
        return response;
    }
}