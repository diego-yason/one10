<div class="py-10 h-screen">
    <div class="flex flex-col px-32 py-24">
        <h1 class="services-font">Services</h1>
                
        <div class="flex flex-wrap gap-6 py-10">
            <div class="products flex flex-col w-full sm:w-[349px]">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="products-font-name">Lorem ipsum dolor sit amet</p>
                    <p class="products-font-price">Lorem ipsum</p>
                </div>
            </div>

            <div class="products flex flex-col w-full sm:w-[349px]">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="products-font-name">Lorem ipsum dolor sit amet</p>
                    <p class="products-font-price">Lorem ipsum</p>
                </div>
                </div>

            <div class="products flex flex-col w-full sm:w-[349px]">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="products-font-name">Lorem ipsum dolor sit amet</p>
                    <p class="products-font-price">Lorem ipsum</p>
                </div>
            </div>

            <div class="products flex flex-col w-full sm:w-[349px]">
                <div class="image bg-white flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="products-font-name">Lorem ipsum dolor sit amet</p>
                    <p class="products-font-price">Lorem ipsum</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="py-10 h-screen">
    <div class="flex flex-col px-32 py-24">
        <h1 class="services-font">
            Shop
        </h1>

        <div class="flex flex-wrap py-10">
            <div class="product-2 flex flex-col">
                <div class="image-2 flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="product-2-description">Films</p>
                    <p class="product-2-font">Lorem ipsum dolor sit amet</p>
                    <button class="border rounded-lg px-6 py-7 font-spaceGrotesk mt-10">Add to cart</button>
                </div>
            </div>

            <div class="product-2 flex flex-col">
                <div class="image-2 flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="product-2-description">Films</p>
                    <p class="product-2-font">Lorem ipsum dolor sit amet</p>
                    <button class="border rounded-lg px-6 py-7 font-spaceGrotesk mt-10">Add to cart</button>
                </div>
            </div>

            <div class="product-2 flex flex-col">
                <div class="image-2 flex items-center justify-center">Placeholder</div>
                        
                <div class="flex flex-col justify-center items-center py-10">
                    <p class="product-2-description">Films</p>
                    <p class="product-2-font">Lorem ipsum dolor sit amet</p>
                    <button class="border rounded-lg px-6 py-7 font-spaceGrotesk mt-10">Add to cart</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="py-48 flex justify-between px-40">
	<div>
		<h2 class="font-spaceGrotesk font-bold text-8xl text-white mb-7">
			<span class="block textOutline text-transparent">Sign up</span> and save
		</h2>
		<p class="text-white font-roboto">Register and Subscribe to get special offers</p>
	</div>
	<a href="#" class="bg-amber-300 font-roboto rounded-4xl px-6 py-2 h-min self-center"
		>Register / Log in</a
	>
</div>

    <style>
        .services-font{
            color: var(--Gray-1, #333);
            /* Headings/h1 */
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: var(--Gray-1, #333);
            font-family: "Space Grotesk";
            font-size: 80px;
            font-style: normal;
            font-weight: 700;
            line-height: 88px; /* 110% */
            letter-spacing: -1.6px;
        }

        .products{
            height: 391px;
            border-radius: 16px;
            background: var(--Yellow, #F2C94C);
        }

        .image{
            height: 257px;
            flex-shrink: 0;
            border-radius: 16px 16px 0px 0px;
        }

        .products-font-name{
            color: var(--Global-black, #000);
            text-align: center;
            font-family: "Space Grotesk";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px; /* 200% */
            letter-spacing: 1.2px;
            text-decoration-line: underline;
            text-decoration-style: solid;
            text-decoration-skip-ink: none;
            text-decoration-thickness: auto;
            text-underline-offset: auto;
            text-underline-position: from-font;
        }

        .products-font-price{
            width: 106px;
            color: var(--Global-black, #000);
            text-align: center;
            font-family: "Open Sans";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 150% */
        }

        .product-2{
            display: flex;
            padding: 40px 30px;
            flex-direction: column;
            align-items: flex-start;
            align-self: stretch;
            background: #FAFAFA;
            border-radius: 16px;
        }

        .product-2-font{
            color: var(--Global-black, #000);
            text-align: center;
            /* headings/h5 */
            font-family: "Space Grotesk";
            font-size: 22px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px; /* 145.455% */
            letter-spacing: 1.2px;
        }

        .product-2-description{
            flex: 1 0 0;
            color: var(--Gray-5, #E0E0E0);
            text-align: center;
            font-family: "Space Grotesk";
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px; /* 200% */
            text-transform: uppercase;
        }

        .image-2{
            height: 214px;
            align-self: stretch;
            background-color: #F2C94C;
        }
    </style>

    <script lang="ts"></script>