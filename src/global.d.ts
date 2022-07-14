/// <reference types="@sveltejs/kit">

type Order = {
    product_id: Number;
    product_name: String;
    amount: Number;
    type: String;
    created_at: Date;
}
