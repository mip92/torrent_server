import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"
export enum FileType {
    TORRENT = "torrent",
    IMAGE = "image"
}

@Injectable()
export class FileService {
    createFile(type: FileType, file):string {
            const fileExtension=file.originalname.split('.').pop()
            if (type=="image") {
                const arr = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG', 'BMP', 'bmp', 'GIF', 'gif', 'ico', 'ICO']
                let isOk = null
                for (let i = 0; i < arr.length; i++) {
                    if (fileExtension == arr[i]) isOk = "ok"
                }
                if (isOk == null) {
                    throw new HttpException({message: [`Файла ${file.originalname} не является картинкой`]}, HttpStatus.BAD_REQUEST)
                }
            }
            if (file.size>2097152) {throw new HttpException({message: [`Размер файла ${file.originalname} больше 2 Мб`]}, HttpStatus.BAD_REQUEST)}
            const fileName=uuid.v4()+'.'+fileExtension
            const filePath=path.resolve(__dirname, '..','static',`${type}File`)
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath,{recursive:true})
            }
            fs.writeFileSync(path.resolve(filePath,fileName),file.buffer)
            return type + 'File/'+fileName
    }
    removeFile(fileName: string) {

    }
}