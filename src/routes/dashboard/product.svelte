<script context="module" lang="ts">

</script>

<script lang="ts">
    import {
        Form, FormGroup, Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader
    } from 'sveltestrap';
    import Grid from "gridjs-svelte"

    const data = [
        {name: "John", email: "john@example.com"},
        {name: "Mark", email: "mark@gmail.com"},
    ]

    let open = false;
    const toggle = () => {
        open = !open
    };
    const formValidate = (event: Event) => {
        const form: HTMLFormElement = event.target as HTMLFormElement;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            toggle();
            form.reset();
            form.classList.remove('was-validated');
        } else {
            form.classList.add('was-validated');
        }
    }
</script>

<svelte:head>
    <title>Products</title>
</svelte:head>

<h1>Products</h1>
<div class="position-relative">
    <Grid {data} sort={true} search={true}/>
    <Button class="position-absolute top-0 end-0" color="primary" on:click={toggle}>Add</Button>
</div>

<Modal isOpen={open} {toggle} scrollable centered>
    <ModalHeader {toggle}>Add new product</ModalHeader>
    <ModalBody>
        <Form id="addProduct" novalidate on:submit={formValidate}>
            <FormGroup>
                <Label for="productName">Product Name</Label>
                <Input type="text" name="productName" id="productName" required/>
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
