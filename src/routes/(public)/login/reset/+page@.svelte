<script lang="ts">
    let email = '';
    function handleSubmit(event: Event) {
        event.preventDefault();
        // TODO: Add your password reset logic here
        alert(`Password reset link sent to ${email}`);
    }
</script>

<div class="forgot-password-container">
    <div class="mx-auto w-96 text-gray-100">
        <span class="text-4xl font-spaceGrotesk font-bold">
            <img src="https://placehold.co/60x50" alt="" class="inline" />
            <span class="logoOutline text-transparent">Studio</span> Lab
        </span>

        <div class="mt-10"></div>
        <h1 class="font-spaceGrotesk text-3xl font-bold mb-6">Forgot Password</h1>
        <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6 mb-5">
            <input
                type="email"
                bind:value={email}
                placeholder="Enter your email"
                class="bg-white p-3 text-gray-800"
                required
            />
            <button class="bg-amber-600 text-white py-2">Send Reset Link</button>
        </form>
        <a href="/login" class="text-brand underline">Back to Log in</a>
    </div>
</div>

<style lang="postcss">
    .forgot-password-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-image: url('https://www.pbs.org/wnet/nature/files/2021/01/pexels-denis-linine-714258.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .logoOutline {
        -webkit-text-stroke: 1px #fff;
    }
</style>