import type {RequestHandler} from "@sveltejs/kit";

type Product = {
    _id: Number;
    name: String;
    description: String;
    amount: Number;
}

let products: Product[] = [{
    _id: 1,
    name: "Coke",
    description: "Coca Cola (Can)",
    amount: 30
}, {
    _id: 2,
    name: "Sprite",
    description: "Sprite (Can)",
    amount: 30
}, {
    _id: 3,
    name: "Water",
    description: "Drinking Water (Bottle)",
    amount: 30
}];

export const get: RequestHandler = () => {
    return {
        status: 200,
        body: JSON.stringify(products)
    };
}
