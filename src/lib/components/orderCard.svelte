<script lang="ts">
    import {Col, Card, Input, FormGroup, Label, Icon} from "sveltestrap";

    export let i: Number;
    export let item: any;
    export let deleteItem = (id: string) => {
    };
</script>

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
