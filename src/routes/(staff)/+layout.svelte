<script>
    import { page } from '$app/stores';
</script>

<style>
    :global(body) {
        background: #ddd;
        margin: 0;
        min-height: 100vh;
    }
    .layout-container {
        display: flex;
        min-height: 100vh;
        /* Remove the dark background */
        background: transparent;
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
            <a href="/dashboard">
			<img src="https://placehold.co/100x60" alt="" />
		    </a>
            <hr style="margin-bottom:2rem;">
            <nav>
                <a href="/dashboard" class:active={$page.url.pathname === '/dashboard'}>Dashboard</a>
                <a href="/orders" class:active={$page.url.pathname.startsWith('/orders')}>Manage Orders</a>
                <a href="/products" class:active={$page.url.pathname.startsWith('/products')}>Manage Prices</a>
                <a href="/messages" class:active={$page.url.pathname.startsWith('/messages')}>Messages</a>
            </nav>
        </div>
        <button>Log out</button>
    </div>
    <div class="main-content">
        <slot />
    </div>
</div>