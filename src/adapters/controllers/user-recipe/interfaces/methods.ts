import { HttpRequest, HttpResponse } from "./http"

export interface UserRecipeControllerMethods {
    handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
