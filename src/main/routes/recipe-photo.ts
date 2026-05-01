import { Router } from "express";
import { upload } from "../config/upload";
import { makeUploadRecipePhoto } from "../../adapters/factories/upload-recipe-photo";
import { makeDeleteRecipePhoto } from "../../adapters/factories/delete-recipe-photo";
import { authGuard } from "../config/middleware/auth-guard";
import { adaptRoute } from "../config/adapt-route";

const uploadPhotoController = makeUploadRecipePhoto();
const deletePhotoController = makeDeleteRecipePhoto();

export default (router: Router): void => {
    router.post("/recipe/:idRecipe/photo", authGuard, upload.single("photo"), adaptRoute(uploadPhotoController))
    router.delete("/recipe/:idRecipe/photo/:photoId", authGuard, adaptRoute(deletePhotoController))
}
