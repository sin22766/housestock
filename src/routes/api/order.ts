import type { RequestHandler } from "@sveltejs/kit";
import dbConnect from "$lib/database/dbConnect";
import { OrderModel, ProductModel } from '$lib/database/dbModel'
import client from "$lib/line/lineClient";
import mongoose from 'mongoose';

const { Types } = mongoose;

export const get: RequestHandler = async () => {
    await dbConnect();
    const orders = await OrderModel.aggregate().unwind("lists").project({
        "_id": 0,
        "product_name": "$lists.product_name",
        "amount": "$lists.amount",
        "type": "$lists.type",
        "createdAt": 1
    });

    return {
        status: 200,
        body: JSON.stringify(orders)
    };
}

export const post: RequestHandler = async ({ request }) => {
    await dbConnect();
    const payload: any[] = await request.json();
    let errorItem: string[] = [];
    const products = await ProductModel.find().select("name amount");
    const orderList = payload.flatMap(item => {
        item.product = new Types.ObjectId(item.product_id);
        delete item.product_id;
        let curProduct = products.find(prod => prod._id.equals(item.product));

        item.product_name = curProduct.name;

        if (curProduct.amount < item.amount) {
            errorItem.push(item.product_name);
            return [];
        }

        if (curProduct.amount >= 10) {
            if (curProduct.amount - item.amount < 10) {
                client.broadcast({
                    type: 'text',
                    text: `${item.product_name} เหลือน้อยกว่า 10 ชิ้นแล้ว`,
                })
            }
        } else if (curProduct.amount - item.amount === 0) {
            client.broadcast({
                type: 'text',
                text: `${item.product_name} หมดแล้ว`,
            })
        }

        return item;
    });

    const depleteReport = (errorItem.length) ? errorItem.join(', ') + "is not enough." : "";

    try {
        await OrderModel.create({ lists: orderList });

        return {
            status: 201,
            body: depleteReport
        }
    } catch (err) {
        console.log(err);
        return {
            status: 400,
            body: depleteReport
        }
    }

}
