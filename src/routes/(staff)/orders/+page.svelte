<input type="text" placeholder="Search Order Number or Customer Name" class="px-5 py-3 rounded-lg bg-white border-0 w-110">

<div class="flex flex-col mt-8">
    <div class="flex mb-5 justify-between">
        <p class="font-bold text-xl">Orders:</p>

        <button class="font-bold rounded-2xl bg-white px-7 hover:cursor-pointer hover:bg-black hover:text-white">Filter</button>
    </div>

    <div class="flex flex-col space-y-11">
        <div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
            <div class="flex justify-between">
                <p class="font-bold">Order #23341</p>

                <p class="flex items-center gap-3">Pending <span class="bg-yellow-300 rounded-3xl w-5 h-5"></span></p>
            </div>

            <p>Customer Name: <span class="font-bold">Juan Dela Cruz</span></p>

            <div class="flex justify-between">
                <p>Order placed: <span class="font-bold">06/16/2025</span></p>

                <button class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl">View Details</button>
            </div>
        </div>

        <div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
            <div class="flex justify-between">
                <p class="font-bold">Order #253121</p>

                <p class="flex items-center gap-3">For pickup/delivery <span class="bg-green-600 rounded-3xl w-5 h-5"></span></p>
            </div>

            <p>Customer Name: <span class="font-bold">Peter Parker</span></p>

            <div class="flex justify-between">
                <p>Order placed: <span class="font-bold">06/10/2025</span></p>

                <button class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl">View Details</button>
            </div>
        </div>

        <div class="flex flex-col space-y-6 bg-white px-5 py-3 rounded-2xl">
            <div class="flex justify-between">
                <p class="font-bold">Order #265317</p>

                <p class="flex items-center gap-3">In progress <span class="bg-blue-600 rounded-3xl w-5 h-5"></span></p>
            </div>

            <p>Customer Name: <span class="font-bold">Barry Allen</span></p>

            <div class="flex justify-between">
                <p>Order placed: <span class="font-bold">06/17/2025</span></p>

                <button class="bg-black rounded-lg font-color text-white py-2 px-6 hover:cursor-pointer hover:shadow-2xl">View Details</button>
            </div>
        </div>
    </div>
</div>