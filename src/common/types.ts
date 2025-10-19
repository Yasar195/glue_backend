export type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    error: string | null;
    statusCode: number;
    message: string;
}

export type MessageResponse = {
    message: string;
}

export type TokenPairResponse = {
    accessToken: string;
    refreshToken: string;
}

export type TokenPayload = {
    userId: string;
}


export type Payload = {
    sub: string;
    email: string;
    exp: number;
}