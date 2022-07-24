<script lang="ts">
    import { Container, Row, Col, Button } from "sveltestrap";
</script>

<svelte:head>
    <title>Index</title>
</svelte:head>

<Container
    class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
>
    <h1 class="text-center">Household Inventory Management</h1>
    <p>
        <Button href="/order" color="primary">Click Here!</Button> to Enter used
        Item.
    </p>
</Container>
