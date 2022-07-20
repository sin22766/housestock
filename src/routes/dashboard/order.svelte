<script lang="ts">
    import { Button, Modal } from "sveltestrap";
    import Grid from "gridjs-svelte";
    import type { Grid as GridJS } from "gridjs";

    let grid: GridJS;

    const columns = [
        {
            id: "product_name",
            name: "Product Name",
        },
        {
            id: "amount",
            name: "Amount",
        },
        {
            id: "type",
            name: "Order Type",
        },
        {
            id: "createdAt",
            name: "Created Time",
            formatter: (cell: any) =>
                new Date(cell).toLocaleTimeString("th", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                }),
        },
    ];

    const server = {
        url: "/api/order",
        then: (data: any) =>
            data.map((item: any) => [
                item.product_name,
                item.amount,
                item.type,
                item.createdAt,
            ]),
    };

    let openOrder = false;
    let openRestock = false;
    const toggleOrder = () => {
        openOrder = !openOrder;
        if (!openOrder) {
            grid.forceRender();
        }
    };
    const toggleRestock = () => {
        openRestock = !openRestock;
        if (!openRestock) {
            grid.forceRender();
        }
    };
</script>

<svelte:head>
    <title>Orders</title>
</svelte:head>

<h1>Orders</h1>
<div class="position-relative">
    <Grid bind:instance={grid} {columns} {server} sort={true} search={true}/>
    <div class="position-absolute top-0 end-0">
        <Button
                color="primary"
                on:click={toggleOrder}>Add Used
        </Button>
        <Button
                color="primary"
                on:click={toggleRestock}>Restock
        </Button>
    </div>
</div>

<Modal header="Add used product" isOpen={openOrder} toggle={toggleOrder} fullscreen>
    <iframe class="w-100 vh-100" src="/order" title="Orders Maker"></iframe>
</Modal>
<Modal header="Add Restock product" isOpen={openRestock} toggle={toggleRestock} fullscreen>
    <iframe class="w-100 vh-100" src="/restock" title="Orders Maker"></iframe>
</Modal>

<style>
    :global(.gridjs-table) {
        min-width: 100%;
    }
</style>
