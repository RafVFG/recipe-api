export interface HttpRequest {
    params?: any
    body?: any
    query?: any
    userId?: number
}

export interface HttpResponse {
    statusCode: number
    body?: any
}
