import type {RequestHandler} from "@sveltejs/kit";
import dbConnect from "$lib/database/dbConnect";
import {OrderModel} from '$lib/database/dbModel'
import {Types} from 'mongoose'

await dbConnect();

export const get: RequestHandler = async () => {
    const orders = await OrderModel.find({}).populate('lists.product'); // find all the data in our database

    let result: any[] = [];

    orders.forEach(order => {
        order.lists.forEach((item: any) => {
            result.push({
                product_name: item.product.name,
                amount: item.amount,
                type: item.type,
                createdAt: order.createdAt
            });
        })
    });

    return {
        status: 200,
        body: JSON.stringify(result)
    };
}

export const post: RequestHandler = async ({request}) => {
    const payload: any[] = await request.json();
    const orderList = payload.map(item => {
        item.product = new Types.ObjectId(item.product_id);
        delete item.product_id;
        return item;
    });

    try {
        const result = await OrderModel.create({lists: orderList});

        return {
            status: 201
        }
    } catch (err) {
        console.log(err);
        return {
            status: 400
        }
    }

}
