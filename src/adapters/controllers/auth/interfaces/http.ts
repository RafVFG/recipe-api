export interface AuthHttpRequest {
    body: Record<string, any>;
    query: Record<string, any>;
}

export interface AuthHttpResponse {
    statusCode: number;
    body?: any;
}
