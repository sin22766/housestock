import type {RequestHandler} from "@sveltejs/kit";
import dbConnect from "$lib/database/dbConnect";
import {OrderModel, ProductModel, ResultOrderModel} from '$lib/database/dbModel'
import client from "$lib/line/lineClient";
import mongoose from 'mongoose';

const {Types} = mongoose;

export const get: RequestHandler = async () => {
    await dbConnect();
    const orders = await OrderModel.aggregate().unwind("lists").project({
        "_id": 0,
        "product": "$lists.product",
        "amount": "$lists.amount",
        "type": "$lists.type",
        "createdAt": 1
    });

    await ResultOrderModel.populate(orders, {path: 'product', select: 'name'});

    return {
        status: 200,
        body: JSON.stringify(orders)
    };
}

export const post: RequestHandler = async ({request}) => {
    await dbConnect();
    const payload: any[] = await request.json();
    let errorItem: string[] = [];
    const products = await ProductModel.find().select("name amount");
    const orderList = payload.flatMap(item => {
        item.product = new Types.ObjectId(item.product_id);
        delete item.product_id;

        let curProduct = products.find(prod => prod._id.equals(item.product));
        if (curProduct.amount < item.amount) {
            errorItem.push(curProduct.name);
            return [];
        }

        if (curProduct.amount >= 5) {
            if (curProduct.amount - item.amount < 5) {
                client.broadcast({
                    type: 'text',
                    text: `${curProduct.name} เหลือน้อยกว่า 5 ชิ้นแล้ว`,
                })
            }
        }

        return item;
    });

    const depleteReport = (errorItem.length) ? errorItem.join(', ') + "is not enough." : "";

    try {
        await OrderModel.create({lists: orderList});

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
