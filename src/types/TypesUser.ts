import { Request } from "express"
import { UploadedFile } from "express-fileupload"


export type User = {
    name: string,
    email: string,
    password: string
}

export type Session = {
    email: string,
    password: string
}

export type Product = {
    name: string,
    price: string,
    description: string,
    banner: string,
    category_id: string
}

export type Order = {
    table: number,
    name: string
}

export type ItemType = {
    order_id: string,
    product_id: string,
    amount: number
}



export type ExtendRequest = Request & {
    email?: string
}