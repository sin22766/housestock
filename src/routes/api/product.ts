import type {RequestHandler} from "@sveltejs/kit";
import dbConnect from "$lib/database/dbConnect";
import {ProductModel} from '$lib/database/dbModel'

export const get: RequestHandler = async () => {
    await dbConnect();
    const products = await ProductModel.find({}).lean(); // find all the data in our database
    return {
        status: 201,
        body: JSON.stringify(products)
    };
}

export const post: RequestHandler = async ({request}) => {
    await dbConnect();
    const payload: any = await request.json();
    try {
        const product = await ProductModel.create({
            name: payload.name,
            description: payload.description,
            amount: payload.amount
        });
        return {
            status: 201,
            body: JSON.stringify(product)
        }
    } catch {
        return {
            status: 400
        }
    }
}

export const patch: RequestHandler = async ({request}) => {
    await dbConnect();
    const payload: any = await request.json();
    try {
        const updateAmount = (payload.type === 'Used') ? -payload.amount : payload.amount;
        const product = await ProductModel.findByIdAndUpdate(payload.product_id, {
            $inc: {amount: updateAmount}
        });
        return {
            status: 201,
            body: JSON.stringify(product)
        }
    } catch {
        return {
            status: 400,
            error: new Error("Product isn't found")
        }
    }
}
