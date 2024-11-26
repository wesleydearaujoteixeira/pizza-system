import { Request } from "express"


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


export type ExtendRequest = Request & {
    email?: string
}