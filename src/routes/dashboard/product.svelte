<script lang="ts">
    import {
        Form,
        FormGroup,
        Input,
        Label,
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "sveltestrap";
    import Grid from "gridjs-svelte";
    import type {Grid as GridJS} from "gridjs";

    let grid: GridJS;

    const columns = ["Product Name", "Description", "Amount"];

    const server = {
        url: "/api/product",
        then: (data: any[]) =>
            data.map((item: any) => [item.name, item.description, item.amount]),
    };

    let open = false;
    const toggle = () => {
        open = !open;
    };

    const submitProduct = async (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const req = await fetch("/api/product", {
            method: "POST",
            headers: {
                accept: "application/json",
            },
            body: JSON.stringify({
                name: formData.get("productName"),
                description: formData.get("productDescription"),
                amount: formData.get("productAmount"),
            }),
        });

        return req.ok;
    };

    const formValidate = (event: Event) => {
        const form: HTMLFormElement = event.target as HTMLFormElement;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            submitProduct(form).then((result) => {
                if (result) {
                    grid.forceRender();
                    form.reset();
                    form.classList.remove("was-validated");
                } else {
                    alert("Add product Error");
                }
            });
        } else {
            form.classList.add("was-validated");
        }
    };
</script>

<svelte:head>
    <title>Products</title>
</svelte:head>

<h1>Products</h1>
<div class="position-relative">
    <Grid bind:instance={grid} {columns} {server} sort={true} search={true}/>
    <Button
            class="position-absolute top-0 end-0"
            color="primary"
            on:click={toggle}>Add
    </Button
    >
</div>

<Modal isOpen={open} {toggle} scrollable centered>
    <ModalHeader {toggle}>Add new product</ModalHeader>
    <ModalBody>
        <Form id="addProduct" novalidate on:submit={formValidate}>
            <FormGroup>
                <Label for="productName">Product Name</Label>
                <Input
                        type="text"
                        name="productName"
                        id="productName"
                        required
                />
            </FormGroup>
            <FormGroup>
                <Label for="productDescription">Product Description</Label>
                <Input
                        type="textarea"
                        name="productDescription"
                        id="productDescription"
                />
            </FormGroup>
            <FormGroup>
                <Label for="productAmount">Amount</Label>
                <Input
                        type="number"
                        name="productAmount"
                        id="productAmount"
                        placeholder="0"
                        min="1"
                        required
                />
            </FormGroup>
        </Form>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" form="addProduct">Add</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>
