<script>
  import { onMount } from 'svelte';
  let email = '';
  let fullName = '';
  let address = '';
  let city = '';
  let country = '';
  let region = '';
  let zip = '';
  let phone = '';
  let payment = '';
  let proof = null;

  let errors = {};
  let touched = {};

  let countries = ['Philippines', 'USA', 'Canada'];
  let regions = ['NCR', 'Luzon', 'Visayas', 'Mindanao'];
  let cities = ['Manila', 'Quezon City', 'Cebu', 'Davao'];

  function validate() {
    errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!fullName) {
      errors.fullName = 'Full name is required';
    } else if (fullName.length < 2) {
      errors.fullName = 'Full name is too short';
    }
    if (!address) {
      errors.address = 'Address is required';
    }
    if (!city) {
      errors.city = 'City is required';
    }
    if (!country) {
      errors.country = 'Country is required';
    }
    if (!region) {
      errors.region = 'Region is required';
    }
    if (!zip) {
      errors.zip = 'Zip/Postal code is required';
    } else if (!/^\d{4,6}$/.test(zip)) {
      errors.zip = 'Invalid zip/postal code';
    }
    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Invalid phone number';
    }
    if (!payment) {
      errors.payment = 'Please select a payment method';
    }
    if (!proof) {
      errors.proof = 'Proof of payment is required';
    }
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    touched = {
      email: true,
      fullName: true,
      address: true,
      city: true,
      country: true,
      region: true,
      zip: true,
      phone: true,
      payment: true,
      proof: true
    };
    if (validate()) {
      // Submit logic here
      alert('Order confirmed!');
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex py-10 justify-evenly">
    <div class="flex flex-col">
        <div class="flex flex-col space-y-11">
            <h1 class="header-1">Checkout</h1>

            <div class="flex flex-col py-10">
                <h2 class="header-2 py-4">Shipping details</h2>
                <div class="container-1 flex items-center justify-start">
                    <p class="typography-1 mx-auto">
                        Already have an account? <span class="login">Login</span> for a faster checkout.
                    </p>
                </div>
            </div>

            <div class="flex flex-col space-y-10">
                <div>
                    <label class="labels">Email for order confirmation</label>
                    <input type="email" bind:value={email} on:blur={() => touched.email = true} placeholder="Please enter your email" class="bg-white p-3 text-gray-800 w-full {errors.email && touched.email ? 'border-2 border-red-500' : ''}" />
                    {#if touched.email && errors.email}
                        <p class="text-red-500 text-sm mt-1">{errors.email}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">Full name</label>
                    <input type="text" bind:value={fullName} on:blur={() => touched.fullName = true} placeholder="Full name" class="bg-white p-3 text-gray-800 w-full {errors.fullName && touched.fullName ? 'border-2 border-red-500' : ''}" />
                    {#if touched.fullName && errors.fullName}
                        <p class="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">Address</label>
                    <input type="text" bind:value={address} on:blur={() => touched.address = true} placeholder="Address" class="bg-white p-3 text-gray-800 w-full {errors.address && touched.address ? 'border-2 border-red-500' : ''}" />
                    {#if touched.address && errors.address}
                        <p class="text-red-500 text-sm mt-1">{errors.address}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">City</label>
                    <select bind:value={city} on:blur={() => touched.city = true} class="bg-white p-3 text-gray-800 w-full {errors.city && touched.city ? 'border-2 border-red-500' : ''}">
                        <option value="">Select city</option>
                        {#each cities as c}
                            <option value={c}>{c}</option>
                        {/each}
                    </select>
                    {#if touched.city && errors.city}
                        <p class="text-red-500 text-sm mt-1">{errors.city}</p>
                    {/if}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="labels">Country</label>
                    <select bind:value={country} on:blur={() => touched.country = true} class="bg-white p-3 text-gray-800 w-full {errors.country && touched.country ? 'border-2 border-red-500' : ''}">
                        <option value="">Select country</option>
                        {#each countries as c}
                            <option value={c}>{c}</option>
                        {/each}
                    </select>
                    {#if touched.country && errors.country}
                        <p class="text-red-500 text-sm mt-1">{errors.country}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">Zip / postal code</label>
                    <input type="text" bind:value={zip} on:blur={() => touched.zip = true} placeholder="Zip / postal code" class="bg-white p-3 text-gray-800 w-full {errors.zip && touched.zip ? 'border-2 border-red-500' : ''}" />
                    {#if touched.zip && errors.zip}
                        <p class="text-red-500 text-sm mt-1">{errors.zip}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">Region</label>
                    <select bind:value={region} on:blur={() => touched.region = true} class="bg-white p-3 text-gray-800 w-full {errors.region && touched.region ? 'border-2 border-red-500' : ''}">
                        <option value="">Select region</option>
                        {#each regions as r}
                            <option value={r}>{r}</option>
                        {/each}
                    </select>
                    {#if touched.region && errors.region}
                        <p class="text-red-500 text-sm mt-1">{errors.region}</p>
                    {/if}
                </div>

                <div>
                    <label class="labels">Phone</label>
                    <input type="text" bind:value={phone} on:blur={() => touched.phone = true} placeholder="Phone" class="bg-white p-3 text-gray-800 w-full {errors.phone && touched.phone ? 'border-2 border-red-500' : ''}" />
                    {#if touched.phone && errors.phone}
                        <p class="text-red-500 text-sm mt-1">{errors.phone}</p>
                    {/if}
                </div>
            </div>
        </div>

        <div class="flex flex-col py-20 space-y-10">
            <h2 class="header-2"> Payment details</h2>

            <div class="grid grid-cols-2 gap-10">
                <div>
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="mr-2" type="radio" name="payment" value="Unionbank" bind:group={payment} on:blur={() => touched.payment = true} />
                        <label class="bank-font">Unionbank</label><br>
                    </div>
                </div>

                <div>
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="mr-2" type="radio" name="payment" value="BDO" bind:group={payment} on:blur={() => touched.payment = true} />
                        <label class="bank-font">BDO</label><br>
                    </div>
                </div>

                <div>
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="mr-2" type="radio" name="payment" value="BPI" bind:group={payment} on:blur={() => touched.payment = true} />
                        <label class="bank-font">BPI</label><br>
                    </div>
                </div>
            </div>

             <div class="flex items-center mt-2">
                <input class="mr-2" type="radio" name="payment" value="gcash" bind:group={payment} on:blur={() => touched.payment = true} />
                <label class="bank-font">gcash - 0917-873-4327</label><br>
            </div>

            {#if touched.payment && errors.payment}
                <p class="text-red-500 text-sm mt-1">{errors.payment}</p>
            {/if}

            <div class="flex flex-col space-y-10">
                 <div>
                    <label class="labels">Proof of payment</label>
                    <input type="file" on:change={e => proof = e.target.files[0]} on:blur={() => touched.proof = true} class="bg-white p-3 text-gray-800 w-full {errors.proof && touched.proof ? 'border-2 border-red-500' : ''}" />
                    {#if touched.proof && errors.proof}
                        <p class="text-red-500 text-sm mt-1">{errors.proof}</p>
                    {/if}
                </div>

                <div class="py-8">
                    <button class="bg-amber-600 text-white py-2 hover:bg-amber-700 transition-colors px-8" type="submit">Confirm order</button>
                </div>
                
            </div>
           
            
        </div>
    </div>
    

    <div class="container-2">
        <div class="flex flex-col py-8 px-5 space-y-3">
            <h1 class="typography-2 py-3">Order summary</h1>

            <div class="flex items-center justify-between px-4">
                <div class="bg-white img"></div>

                <div class="flex flex-col space-y-3">
                    <p class="typography-3">
                        Disposable Camera Service <br> <span class="desc">(Processing + Scanning)</span>
                    </p>

                    <p class="Qty">QTY: 1</p>

                </div>
    
                <p>P 250</p>
            </div>
            
            <div class="flex flex-col space-y-10">
                <hr>

                <h1 class="header-3">Enter promo code</h1>

                <hr>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between">
                    <p class="breakdown">Items</p>
                    <p class="breakdown">P250</p>
                </div>

                <div class="flex justify-between">
                    <p class="breakdown">Shipping</p>
                    <p class="breakdown">P0.00</p>
                </div>
            </div>
            

            <div class="flex justify-between py-15">
                <h1 class="total">Total</h1>

                <p class="total">P250</p>
            </div>
        </div>
    </div>
</form>


<style>

    .confirm-button-font{
        color: var(--Gray-1, #333);
        /* paragraphs/p */
        font-family: Roboto;
        font-size: 0.9375rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.3875rem; /* 148% */
        letter-spacing: 0.0375rem;
    }

    .confirm-button{
        border-radius: 1.875rem;
        border: 1px solid var(--Yellow, #F2C94C);
        background: var(--Yellow, #F2C94C);
    }

    .bank-font{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem; /* 102.857% */
        text-transform: uppercase;
    }

    .radio{
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
        stroke-width: 1px;
        stroke: var(--Gray-3, #828282);
    }
    .bank-img{
        width: 20.0625rem;
        height: 17.1875rem;
        flex-shrink: 0;
        border-radius: 0.625rem;
    }
    .breakdown{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.9rem; /* 102.857% */
        text-transform: uppercase;
    }

    .total{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem; /* 60% */
        text-transform: uppercase;
    }
    .header-1{
        color: var(--Gray-1, #333);
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: var(--Gray-1, #333);
        font-family: "Space Grotesk";
        font-size: 5rem;
        font-style: normal;
        font-weight: 700;
        line-height: 5.5rem;
        letter-spacing: -0.1rem;
    }

    .header-2{
        color: var(--Global-black, #000);
        /* Headings/h2 */
        font-family: "Space Grotesk";
        font-size: 2.375rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.925rem; /* 123.158% */
    }

    .header-3{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.9rem; /* 102.857% */
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
        text-decoration-thickness: auto;
        text-underline-offset: auto;
        text-underline-position: from-font;
        text-transform: uppercase;
    }

    .container-1{
        width: 100%;
        height: 4.0625rem;
        flex-shrink: 0;
        border-radius: 0.25rem;
        background: #D9D9D9;
    }

    .container-2{
        width: 32.3125rem;
        height: 29.5rem;
        flex-shrink: 0;
        border-radius: 1rem;
        background: #D9D9D9;
    }

    .typography-1{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem; /* 102.857% */
        text-transform: uppercase;
    }

    .typography-2{
        color: var(--Global-black, #000);
        font-family: "Space Grotesk";
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.53125rem; /* 153.125% */
        letter-spacing: 0.075rem;
    }

    .typography-3{
        color: var(--Global-black, #000);
        font-family: "Space Grotesk";
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2rem; /* 200% */
        letter-spacing: 0.075rem;
    }

    .desc{
        color: var(--Global-black, #000);
        font-family: "Space Grotesk";
        font-size: 1rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.53125rem;
        letter-spacing: 0.075rem;
    }

    .Qty{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem; /* 102.857% */
        text-transform: uppercase;
    }

    .login{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem;
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
        text-decoration-thickness: auto;
        text-underline-offset: auto;
        text-underline-position: from-font;
        text-transform: uppercase;
    }

    .labels{
        color: var(--Global-black, #000);
        font-family: "Open Sans";
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.9rem; /* 102.857% */
        text-transform: uppercase;
    }

    .img{
        width: 3.47913rem;
        height: 3.6875rem;
        flex-shrink: 0;
        border-radius: 0.625rem;
    }
</style>