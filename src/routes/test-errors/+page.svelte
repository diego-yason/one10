<script>
    const errorTypes = [
        { code: 400, name: "Bad Request" },
        { code: 401, name: "Unauthorized" },
        { code: 403, name: "Forbidden" },
        { code: 404, name: "Not Found" },
        { code: 500, name: "Internal Server Error" },
        { code: 502, name: "Bad Gateway" },
        { code: 503, name: "Service Unavailable" },
        { code: 504, name: "Gateway Timeout" }
    ];

    function testDirectNavigation(code) {
        window.location.href = `/errors/${code}`;
    }

    function testAPIError(code) {
        window.location.href = `/api/test-error?code=${code}`;
    }

    function testNonexistentPage() {
        window.location.href = '/this-page-does-not-exist-' + Math.random();
    }
</script>

<div class="min-h-screen py-20 px-6 flex flex-col items-center">
    <div class="max-w-4xl w-full">
        <h1 class="font-spaceGrotesk text-4xl text-white font-bold mb-8 text-center">
            Error Pages Test
        </h1>
        
        <div class="bg-gray-800 rounded-lg p-8 mb-10">
            <h2 class="font-spaceGrotesk text-2xl text-amber-300 mb-6">Direct Navigation to Error Pages</h2>
            <p class="text-white mb-6">These links navigate directly to the error page components:</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each errorTypes as error}
                    <button 
                        on:click={() => testDirectNavigation(error.code)}
                        class="bg-gray-700 hover:bg-gray-600 transition-colors text-white py-3 px-4 rounded-lg"
                    >
                        {error.code}: {error.name}
                    </button>
                {/each}
            </div>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-8 mb-10">
            <h2 class="font-spaceGrotesk text-2xl text-amber-300 mb-6">Test API Error Handling</h2>
            <p class="text-white mb-6">These trigger actual errors through the API:</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each errorTypes as error}
                    <button 
                        on:click={() => testAPIError(error.code)}
                        class="bg-gray-700 hover:bg-gray-600 transition-colors text-white py-3 px-4 rounded-lg"
                    >
                        {error.code}: {error.name}
                    </button>
                {/each}
            </div>
        </div>
        
        <div class="bg-gray-800 rounded-lg p-8">
            <h2 class="font-spaceGrotesk text-2xl text-amber-300 mb-6">404 Not Found Test</h2>
            <p class="text-white mb-6">This navigates to a random non-existent URL to test the 404 page:</p>
            
            <button 
                on:click={testNonexistentPage}
                class="bg-amber-300 hover:bg-amber-400 transition-colors text-black font-bold py-3 px-6 rounded-4xl"
            >
                Test 404 Page
            </button>
        </div>
    </div>
</div>

<style>
    .rounded-4xl {
        border-radius: 2rem;
    }
</style>
