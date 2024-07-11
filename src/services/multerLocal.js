import multer, {diskStorage } from "multer";

export function uploadFile()
{
    const storage =diskStorage({}) 

    const multerUpload = multer( { storage } )
     
    return multerUpload
}