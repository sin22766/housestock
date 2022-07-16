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
        Icon,
    } from "sveltestrap";

    let orderItems: any[] = [];

    const addOrder = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const orderItem: any = JSON.parse(String(formData.get("orderItem")));
        const orderAmount: Number = Number(formData.get("orderAmount"));
        const searchObject = orderItems.find(
            (item) => item.product_id === orderItem.id
        );

        if (searchObject) {
            searchObject.amount += orderAmount;
        } else {
            orderItems.push({
                product_id: orderItem.id,
                product_name: orderItem.name,
                amount: orderAmount,
                type: "Used",
            });
        }

        orderItems = orderItems;
    };

    const deleteItem = (id: Number) => {
        orderItems = orderItems.filter((item) => item.product_id !== id);
    };

    const submitOrder = async () => {
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
    <title>Add orders</title>
</svelte:head>

<Container class="mt-lg-5 mt-4">
    <Row>
        <Col xs="12" md="6" lg="4" class="my-2">
            <Card body>
                <h4>Add your Item Here!</h4>
                <p class="text-muted">Choose Item you used and enter amount.</p>
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
                                    })}>{product.name}</option
                                >
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
                                on:click={submitOrder}>Submit
                        </Button
                        >
                    </FormGroup>
                </Form>
            </Card>
        </Col>
        <Col xs="12" md="6" lg="8">
            <Row>
                {#each orderItems as item, i}
                    <Col md="12" lg="6" class="my-2">
                        <Card body>
                            <button
                                    class="btn position-absolute top-0 end-0"
                                    on:click={() => {
                                    deleteItem(item.product_id);
                                }}
                            >
                                <Icon name="trash"/>
                            </button>
                            <FormGroup>
                                <Label for="orderItem{i}">Item</Label>
                                <Input
                                        type="text"
                                        id="orderItem{i}"
                                        value={item.product_name}
                                        disabled
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="orderAmount{i}">Amount</Label>
                                <Input
                                        type="number"
                                        id="orderAmount{i}"
                                        value={item.amount}
                                        disabled
                                />
                            </FormGroup>
                        </Card>
                    </Col>
                {/each}
            </Row>
        </Col>
    </Row>
</Container>
