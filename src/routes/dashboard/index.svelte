<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async ({ fetch }) => {
        const res = await fetch("/api/product");

        if (res.ok) {
            const products = await res.json();
            return {
                props: { products },
            };
        }

        const { message } = await res.json();
        return {
            error: new Error(message),
        };
    };
</script>

<script lang="ts">
    import {
        Container,
        Row,
        Col,
        Card,
        FormGroup,
        Label,
        Input,
    } from "sveltestrap";

    export let products: any[];

    let depletedList: any[] = [];

    products.forEach((item) => {
        if (item.amount < 10) {
            depletedList.push(item);
        }
    });
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<h1>Dashboard</h1>
<Container>
    <Row>
        <Col><h3>(Almost) Depleted Item</h3></Col>
    </Row>
    <Row>
        {#if depletedList.length}
            {#each depletedList as item, i}
                <Col xs="12" sm="6" md="4" lg="3">
                    <Card body class="my-2">
                        <FormGroup>
                            <Label for="orderItem{i}">Item</Label>
                            <Input
                                type="text"
                                id="orderItem{i}"
                                value={item.name}
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
        {:else}
            <Col
                ><p>
                    Currently, there isn't any item that almost out of stock.
                </p></Col
            >
        {/if}
    </Row>
</Container>
