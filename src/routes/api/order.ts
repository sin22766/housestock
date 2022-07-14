import type {RequestHandler} from "@sveltejs/kit";

let orders: Order[] = [];

export const get: RequestHandler = () => {
    return {
        status: 200,
        body: JSON.stringify(orders)
    };
}

export const post: RequestHandler = async ({request}) => {
    const payload: any[] = await request.json();
    const orderDate = new Date();
    payload.forEach(item => {
        item.created_at = orderDate;
        orders.push(item)
    });
    return {
        status: 200,
        body: JSON.stringify(orders)
    };
}
