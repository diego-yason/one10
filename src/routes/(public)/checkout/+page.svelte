<div class="flex py-10 justify-evenly">
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
                <div class="flex flex-col space-y-3">
                    <p class="labels">Email for order confirmation</p>
                    <input type="text" class="input px-3">
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">Full name</p>
                    <input type="text" class="input px-3">
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">Address</p>
                    <input type="text" class="input px-3">
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">City</p>
                    <select class="input hover:cursor-pointer"></select>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col space-y-3">
                    <p class="labels">Country</p>
                    <select class="input-2 hover:cursor-pointer"></select>
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">Zip / postal code</p>
                    <select class="input-2 hover:cursor-pointer"></select>
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">Region</p>
                    <select class="input-2 hover:cursor-pointer"></select>
                </div>

                <div class="flex flex-col space-y-3">
                    <p class="labels">Phone</p>
                    <select class="input-2 hover:cursor-pointer"></select>
                </div>
            </div>
        </div>

        <div class="flex flex-col py-20 space-y-10">
            <h2 class="header-2"> Payment details</h2>

            <div class="grid grid-cols-2 gap-10">
                <div class="flex flex-col space-y-3">
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="radio" type="radio">
                        <label class="bank-font">Unionbank</label><br>
                    </div>
                </div>

                <div class="flex flex-col space-y-3">
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="radio" type="radio">
                        <label class="bank-font">BDO</label><br>
                    </div>
                </div>

                <div class="flex flex-col space-y-3">
                    <div class="bank-img bg-white"></div>
                    <div class="flex items-center">
                        <input class="radio" type="radio">
                        <label class="bank-font">BPI</label><br>
                    </div>
                </div>
            </div>

             <div class="flex items-center">
                <input class="radio" type="radio">
                <label class="bank-font">gcash - 0917-873-4327</label><br>
            </div>

            <div class="flex flex-col space-y-10">
                 <div class="flex flex-col space-y-6">
                    <p class="labels">Proof of payment</p>
                    <input type="file" class="input">
                </div>

                <div class="py-8">
                    <button class="confirm-button confirm-button-font px-8 py-3">Confirm order</button>
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
</div>


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

    .input{
        width: 100%;
        height: 4.0625rem;
        flex-shrink: 0;
        border-radius: 0.25rem;
        border: 1px solid var(--Gray-3, #000000);   
    }

    .input-2{
        width: 100%;
        height: 4.0625rem;
        flex-shrink: 0;
        border-radius: 0.25rem;
        border: 1px solid var(--Gray-3, #000000);
    }

    .img{
        width: 3.47913rem;
        height: 3.6875rem;
        flex-shrink: 0;
        border-radius: 0.625rem;
    }
</style>