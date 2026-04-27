import { Request, Response } from "express";

export function adaptRoute(controller: { handle: (req: any) => Promise<any> }) {
    return async (req: Request, res: Response) => {
        const httpRequest = { params: req.params, body: req.body, query: req.query, file: req.file, userId: (req as any).userId };
        const httpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    };
}
