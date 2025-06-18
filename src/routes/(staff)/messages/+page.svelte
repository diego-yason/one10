<div class="p-8 bg-gray-300 min-h-screen">
  <input
    type="text"
    placeholder="Search by Sender or Order Number"
    class="px-5 py-3 rounded-lg bg-white border-0 w-110"
  />

  <div class="flex flex-col mt-8">
    <p class="font-bold text-xl mb-5">Messages:</p>

    <div class="flex flex-col space-y-3">
      <!-- Repeat this block for each message -->
      <div class="flex justify-between items-center bg-white px-5 py-4 rounded-2xl shadow-sm">
        <div>
          <p class="font-bold">Bruce Wayne:</p>
          <p class="text-gray-700">Follow Up regarding Order #223451</p>
          <p class="text-sm text-gray-500">Hi I’m writing this message...</p>
        </div>
        <p class="text-sm font-bold text-gray-600">6:06 PM</p>
      </div>

      <!-- Duplicate to match the number of messages shown -->
      <div class="flex justify-between items-center bg-white px-5 py-4 rounded-2xl shadow-sm">
        <div>
          <p class="font-bold">Bruce Wayne:</p>
          <p class="text-gray-700">Follow Up regarding Order #223451</p>
          <p class="text-sm text-gray-500">Hi I’m writing this message...</p>
        </div>
        <p class="text-sm font-bold text-gray-600">6:06 PM</p>
      </div>

      <!-- Add more message blocks as needed -->
    </div>
  </div>
</div>
