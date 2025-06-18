<script>
    // You can add logic for active links or user info here if needed
</script>

<style>
    .layout-container {
        display: flex;
        min-height: 100vh;
        background: #222;
    }
    .sidebar {
        width: 260px;
        background: #666;
        color: #fff;
        padding: 2rem 1rem 1rem 1rem;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .sidebar nav {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .sidebar a, .sidebar .active {
        text-decoration: none;
        color: inherit;
        padding: 0.5rem 1rem;
        border-radius: 20px;
    }
    .sidebar .active {
        background: #bbb;
        color: #222;
        font-weight: bold;
    }
    .sidebar button {
        margin-top: 2rem;
        background: #fff;
        color: #222;
        border: none;
        border-radius: 10px;
        padding: 0.5rem 1.5rem;
        cursor: pointer;
    }
    .main-content {
        flex: 1;
        background: #ddd;
        padding: 2rem;
        border-radius: 20px;
        margin: 1rem;
        overflow: auto;
    }
</style>

<div class="layout-container">
    <div class="sidebar">
        <div>
            <div style="font-size:2rem;font-weight:bold;margin-bottom:2rem;">110°</div>
            <hr style="margin-bottom:2rem;">
            <nav>
                <a href="/(staff)/dashboard" class:active={$page.url.pathname === '/(staff)/dashboard'}>Dashboard</a>
                <a href="/(staff)/orders" class:active={$page.url.pathname.startsWith('/(staff)/orders')}>Manage Orders</a>
                <a href="/(staff)/products" class:active={$page.url.pathname.startsWith('/(staff)/products')}>Manage Prices</a>
                <a href="/(staff)/messages" class:active={$page.url.pathname.startsWith('/(staff)/messages')}>Messages</a>
            </nav>
        </div>
        <button>Log out</button>
    </div>
    <div class="main-content">
        <slot />
    </div>
</div>