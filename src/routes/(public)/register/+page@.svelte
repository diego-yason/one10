<div class="mx-auto w-96 text-gray-100">
    <span class="text-4xl font-spaceGrotesk font-bold">
        <img src="https://placehold.co/60x50" alt="" class="inline" />
        <span class="logoOutline text-transparent">Studio</span> Lab
    </span>

    <div class="mb-7 mt-10">
        <h1 class="font-spaceGrotesk text-3xl font-bold">Create your account</h1>
    </div>
    <form action="" class="flex flex-col gap-6 mb-5">
        <input
            type="text"
            placeholder="First name"
            class="bg-white p-3 text-gray-800"
        />
        <input
            type="text"
            placeholder="Last name"
            class="bg-white p-3 text-gray-800"
        />
        <input
            type="email"
            placeholder="Please enter your email"
            class="bg-white p-3 text-gray-800"
        />
        <input
            type="password"
            placeholder="Enter password"
            class="bg-white p-3 text-gray-800"
        />
        <button class="bg-amber-600 text-white py-2">Sign up</button>
    </form>

    <div class="mt-16 mb-11">
        <p>Or create an account using</p>
        <div class="flex gap-2.5">
            <button class=""><img src="https://placehold.co/40" alt="" /></button>
            <button class=""><img src="https://placehold.co/40" alt="" /></button>
        </div>
	</div>
    <p>
        Already have an account?
        <a href="/login" class="text-brand underline">Log in</a>
    </p>
</div>

<style lang="postcss">
    :global(body) {
        background-image: url('https://www.pbs.org/wnet/nature/files/2021/01/pexels-denis-linine-714258.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logoOutline {
        -webkit-text-stroke: 1px #fff;
    }
</style>