<script context="module" lang="ts">
    import type {Load} from "@sveltejs/kit";

    export const load: Load = async ({fetch}) => {
        const res = await fetch("/api/product");

        if (res.ok) {
            const products = await res.json();
            return {
                props: {products},
            };
        }

        const {message} = await res.json();
        return {
            error: new Error(message),
        };
    };
</script>

<script lang="ts">
    import {
        Col,
        Container,
        Row,
        Card,
        Form,
        FormGroup,
        Input,
        Label,
        Button,
    } from "sveltestrap";
    import Select from "svelte-select";
    import OrderCard from "$lib/components/orderCard.svelte";

    let orderItems: any[] = [];

    let selectedOption: any = "";
    let selectedAmount: Number;
    let selectedError: boolean = false;

    const addOrder = () => {
        const orderItem: any = JSON.parse(selectedOption.value);
        const orderAmount: Number = selectedAmount;
        const searchObject = orderItems.find(
            (item) => item.product_id === orderItem.id
        );

        const productAmount: Number = products.find(
            (item) => item._id === orderItem.id
        ).amount;

        if (orderAmount <= productAmount) {
            if (searchObject) {
                if (searchObject.amount + orderAmount <= productAmount) {
                    searchObject.amount += orderAmount;
                } else {
                    alert(`${orderItem.name} is not enough!`);
                }
            } else {
                orderItems.push({
                    product_id: orderItem.id,
                    product_name: orderItem.name,
                    amount: orderAmount,
                    type: "Used",
                });
            }
        } else {
            alert(`${orderItem.name} is not enough!`);
        }

        orderItems = orderItems;
    };

    const deleteItem = (id: string) => {
        orderItems = orderItems.filter((item) => item.product_id !== id);
    };

    const submitOrder = async () => {
        if (!orderItems.length) {
            console.error("No item in Order");
            return;
        }
        const req = await fetch("/api/order", {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: JSON.stringify(
                orderItems.map((item) => {
                    delete item.product_name;
                    return item;
                })
            ),
        });

        if (req.ok) {
            orderItems = [];
        } else {
            alert("Order failed to submit!");
        }
    };

    const formValidate = (event: Event) => {
        const form: HTMLFormElement = event.target as HTMLFormElement;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() && selectedOption) {
            addOrder();
            selectedError = false;
            form.reset();
            form.classList.remove("was-validated");
        } else {
            if (!selectedOption) {
                selectedError = true;
            }
            form.classList.add("was-validated");
        }
    };

    export let products: any[];

    const itemOption = products.map((prod) => {
        return {
            value: JSON.stringify({id: prod._id, name: prod.name}),
            label: prod.name,
        };
    });
</script>

<svelte:head>
    <title>Used orders</title>
</svelte:head>

<Container class="mt-lg-5 mt-4">
    <Row>
        <Col xs="12" md="6" lg="4" class="my-2">
            <Card body>
                <h4>Add used Item Here!</h4>
                <p class="text-muted">Choose Item you used and enter amount.</p>
                <Form novalidate on:submit={formValidate}>
                    <FormGroup>
                        <Label for="orderItem">Item</Label>
                        <Select
                                id="orderItem"
                                bind:value={selectedOption}
                                items={itemOption}
                                hasError={selectedError}
                                placeholder="Select Item"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="orderAmount">Amount</Label>
                        <Input
                                type="number"
                                id="orderAmount"
                                placeholder="0"
                                min="1"
                                bind:value={selectedAmount}
                                required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary">Add</Button>
                        <Button
                                type="button"
                                color="warning"
                                class="float-end"
                                on:click={submitOrder}
                        >Submit
                        </Button>
                    </FormGroup>
                </Form>
            </Card>
        </Col>
        <Col xs="12" md="6" lg="8">
            <Row>
                {#each orderItems as item, i}
                    <OrderCard {i} {item} {deleteItem}/>
                {/each}
            </Row>
        </Col>
    </Row>
</Container>
