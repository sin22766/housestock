<script lang="ts">
    import {Col, Container, Row, Nav, NavItem, NavLink, Icon, Tooltip} from 'sveltestrap';
    import { onMount } from 'svelte';

    let activeTab: String;
    onMount(() => {
        activeTab = document.title;
    })
</script>

<Container fluid>
    <Row>
        <Col sm="auto" class="bg-light sticky-top p-0">
            <div class="d-flex flex-sm-column flex-shrink-0">
                <a id="navHome" href="/" class="d-block p-4 link-dark text-center text-decoration-none">
                    <Icon name="house-fill" class="fs-2"/>
                    <Tooltip class="d-none d-sm-block" placement="right" target="navHome">Home</Tooltip>
                </a>
                <Nav pills class="flex-sm-column mb-auto text-center ms-auto">
                    <NavItem>
                        <NavLink active={activeTab === 'Dashboard'} on:click={() => activeTab = 'Dashboard'}
                                 class="p-4 border-bottom rounded-0" href="/dashboard" id="navDashboard">
                            <Icon class="fs-2" name="speedometer2"/>
                            <Tooltip class="d-none d-sm-block" placement="right" target="navDashboard">Dashboard</Tooltip>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={activeTab === 'Orders'} on:click={() => activeTab = 'Orders'}
                                 class="p-4 border-bottom rounded-0" href="/dashboard/order" id="navOrder">
                            <Icon class="fs-2" name="table"/>
                            <Tooltip class="d-none d-sm-block" placement="right" target="navOrder">Orders</Tooltip>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={activeTab === 'Products'} on:click={() => activeTab = 'Products'}
                                 class="p-4 border-bottom rounded-0"
                                 href="/dashboard/product" id="navProduct">
                            <Icon class="fs-2" name="grid"/>
                            <Tooltip class="d-none d-sm-block" placement="right" target="navProduct">Products</Tooltip>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
        </Col>
        <div class="col-sm p-3 min-vh-100">
            <!-- content -->
            <slot/>
        </div>
    </Row>
</Container>


