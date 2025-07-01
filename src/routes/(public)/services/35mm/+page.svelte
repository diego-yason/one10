<script lang="ts">
import { user, isStaffUser } from '$lib/stores/auth';
let pushProcessing = 1;
</script>

<div class="flex flex-col max-w-4xl w-full ml-32 mx-auto">
    <div class="flex flex-col items-start mb-12">
        <h2 class="font-spaceGrotesk font-bold text-7xl mb-8">Develop <span class="textOutline text-transparent">+ Scanning</span></h2>
        <img src="https://placehold.co/350x250" alt="35mm Film" class="rounded-lg w-[350px] h-[250px] object-cover bg-white mb-8" />
    </div>
    
    <h2 class="font-spaceGrotesk font-bold text-5xl mb-2">35MM FILM</h2>
    <p class="text-gray-400 text-2xl mb-8">P200</p>
    <form class="w-full flex flex-col gap-6">
        <div>
            <label class="block font-bold mb-2 text-sm">FILM BRAND NAME (TYPE 'GENERIC' IF NO BRAND)*</label>
            <input type="text" class="w-full px-4 py-2 rounded border border-gray-300 bg-white" placeholder="Type your film's brand name" />
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">PROCESS TYPE</label>
            <select class="w-full px-4 py-2 rounded border border-gray-300 bg-white">
                <option value="">Select process type</option>
            </select>
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">PUSH PROCESSING</label>
            <div class="flex items-center gap-4">
                <input type="range" min="1" max="3" step="1" bind:value={pushProcessing} class="w-40" />
                <span class="font-bold">{pushProcessing}</span>
            </div>
        </div>
        <div>
            <label class="block font-bold mb-2 text-sm">RETURNING NEGATIVES</label>
            <select class="w-full px-4 py-2 rounded border border-gray-300 bg-white">
                <option value="">Select how would you like to get your negatives back</option>
            </select>
        </div>
        <div class="flex flex-col gap-2 mt-2">
            <label class="text-sm"><input type="radio" name="scanOption" /> SCAN FILM AND EMAIL ME SOFT COPIES +P100.00</label>
            <label class="text-sm"><input type="radio" name="scanOption" /> PROCESS ONLY (I WILL SCAN AND PRINT ON MY OWN)</label>
        </div>
        <div class="flex gap-4 mt-6 items-center">
            <button type="button" class="bg-amber-300 rounded-4xl px-8 py-2 font-bold text-black">Add to cart</button>
        </div>
    </form>
</div> 

<section class="w-full mt-16 flex flex-col md:flex-row">
  <div class="bg-amber-300 flex-1 flex flex-col justify-center items-start py-16 px-10" style="padding-left: 8rem;">
    <h2 class="text-4xl font-bold mb-8">Reminders</h2>
    <div>
      <h3 class="text-2xl font-bold mb-4">We only accept</h3>
      <ul class="text-lg text-gray-700 font-medium space-y-2">
        <li>135mm/35 mm Disposables</li>
        <li>120 format/ Medium format</li>
        <li>C-41/C16 Process</li>
        <li>Black and White Process</li>
        <li>Push Processing</li>
      </ul>
    </div>
  </div>
  <div class="flex-1 flex flex-col justify-center items-center relative min-h-[300px] bg-cover bg-center" style="background-image: url('https://placehold.co/350x250');">
    <h2 class="text-3xl font-bold mb-6 text-black">Got some questions?</h2>
    <a href="/faq" class="bg-amber-300 rounded-4xl px-8 py-3 font-bold text-black text-lg">Read our FAQs</a>
  </div>
</section>
{#if !$user}
<div class="flex justify-between px-40 background-color py-24">
    <div>
        <h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
            <span class="block textOutline text-transparent">Sign up</span> and save
        </h2>
        <p class="text-white font-roboto">Register and Subscribe to get special offers</p>
    </div>
    <a href="/register" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center">Register / Log in</a>
</div>
{/if}