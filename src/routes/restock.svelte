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
    import OrderCard from "$lib/components/orderCard.svelte";

    let restockItems: any[] = [];

    const addOrder = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const restockItem: any = JSON.parse(String(formData.get("orderItem")));
        const restockAmount: Number = Number(formData.get("orderAmount"));
        const searchObject = restockItems.find(
            (item) => item.product_id === restockItem.id
        );

        if (searchObject) {
            searchObject.amount += restockAmount;
        } else {
            restockItems.push({
                product_id: restockItem.id,
                product_name: restockItem.name,
                amount: restockAmount,
                type: "Added",
            });
        }

        restockItems = restockItems;
    };

    const deleteItem = (id: string) => {
        restockItems = restockItems.filter((item) => item.product_id !== id);
    };

    const submitOrder = async () => {
        const req = await fetch("/api/order", {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: JSON.stringify(
                restockItems.map((item) => {
                    delete item.product_name;
                    return item;
                })
            ),
        });

        if (req.ok) {
            restockItems = [];
        } else {
            alert("Restock orders failed to submit!");
        }
    };

    const formValidate = (event: Event) => {
        const form: HTMLFormElement = event.target as HTMLFormElement;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            addOrder(form);
            form.reset();
            form.classList.remove("was-validated");
        } else {
            form.classList.add("was-validated");
        }
    };

    export let products: any[];
</script>

<svelte:head>
    <title>Restock products</title>
</svelte:head>

<Container class="mt-lg-5 mt-4">
    <Row>
        <Col xs="12" md="6" lg="4" class="my-2">
            <Card body>
                <h4>Add Restock Item Here!</h4>
                <p class="text-muted">
                    Choose Item you Restock and enter amount.
                </p>
                <Form novalidate on:submit={formValidate}>
                    <FormGroup>
                        <Label for="orderItem">Item</Label>
                        <Input
                                type="select"
                                name="orderItem"
                                id="orderItem"
                                required
                        >
                            {#each products as product}
                                <option
                                        value={JSON.stringify({
                                        id: product._id,
                                        name: product.name,
                                    })}
                                >
                                    {product.name}
                                </option>
                            {/each}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="orderAmount">Amount</Label>
                        <Input
                                type="number"
                                name="orderAmount"
                                id="orderAmount"
                                placeholder="0"
                                min="1"
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
                {#each restockItems as item, i}
                    <OrderCard {i} {item} {deleteItem}/>
                {/each}
            </Row>
        </Col>
    </Row>
</Container>
