import { HttpResponse } from "../recipe/interfaces/http";

export function response() {
    async function badRequest(error: string): Promise<HttpResponse> {
        return { statusCode: 400, body: error }
    }

    async function unauthorized(error: string): Promise<HttpResponse> {
        return { statusCode: 401, body: error }
    }

    async function notFound(error: string): Promise<HttpResponse> {
        return { statusCode: 404, body: error }
    }

    async function conflict(error: string): Promise<HttpResponse> {
        return { statusCode: 409, body: error }
    }

    async function serverError(error: string): Promise<HttpResponse> {
        return { statusCode: 500, body: error }
    }

    async function ok(data?: any): Promise<HttpResponse> {
        return { statusCode: 200, body: data }
    }

    async function created(data?: any): Promise<HttpResponse> {
        return { statusCode: 201, body: data }
    }

    return {
        badRequest,
        unauthorized,
        notFound,
        conflict,
        serverError,
        ok,
        created,
    }
}