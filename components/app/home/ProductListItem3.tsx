import React from "react";
import insightsClient from "search-insights";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import { shimmer, toBase64, toINR } from "../../../utilities/common";
import { pluralize } from "../../../utilities";
import { useState } from "react";
import Image from 'next/image'

const getPricingSlab = (pricingSlabs, userCity) => {
  let filterSlab = pricingSlabs.filter(ps => ps.city == userCity)
  if(filterSlab.length == 0){
   return pricingSlabs[0];
  }else{
    return filterSlab[0]
  }
}

function ProductListItem3({ product, selectedCategory, uid, page }) {
  // console.log(product);
  const appId = "VXW45ZDJ47";
  const apiKey = "bdbf648eeb26a9336cda8e71aaf8f32c";
  insightsClient("init", { appId, apiKey, useCookie: true });
  const router = useRouter();
  const [session] = useSession();
  const [pricingSlab] = useState(getPricingSlab(product.pricing, session.user.defaultCity));


  return (
    <div onClick={() => router.push(`/product/${product._id}`)} className="bg-white rounded-sm p-2 border">
      <div className="relative p-2">

      <Image alt={product?.name}src={product?.thumbnail && product?.thumbnail != '' ? product?.thumbnail : product.media[0]} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`} width={500} height={500} className="w-max h-[100%]"/>

        {/* <img src={product?.thumbnail && product?.thumbnail != '' ? product?.thumbnail : product.media[0]} alt={} /> */}
       

        {!pricingSlab.trackInventory ?
        <div className="bg-gray-200 p-2 py-1 text-[10px] absolute top-[5px] left-[5px] rounded-full font-semibold flex justify-center items-center">Subject to availability</div>
        :
        pricingSlab.inventoryStatus == "InStock" && pricingSlab.availableInventory > 0 ?
        <div className="bg-green-100 p-2 py-1 text-green-800 text-[10px] font-bold absolute top-[5px] left-[5px] rounded-full flex justify-center items-center">
            Available : {pricingSlab.availableInventory} {pricingSlab.availableInventory > 1 ? pluralize(product?.unit) : product?.unit}
        </div>
        :
        <div className="bg-red-100 text-red-800 p-2 py-1 text-[10px] absolute top-[5px] left-[5px] rounded-full font-semibold flex justify-center items-center">
           Out Of Stock
        </div>
      }
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <p className="font-medium leading-tight" style={{ display: "-webkit-box", "-webkit-line-clamp": 3, "-webkit-box-orient": "vertical" }}>
          {product?.name}
        </p>
        <div>
          <div className="text-brand-600 text-sm font-bold">
            {toINR(pricingSlab.slabPricing[pricingSlab.slabPricing.length - 1].rate)} Per {product?.unit}
            <span className="bg-green-500 p-1 rounded text-white text-[10px] ml-2">
              {pricingSlab.slabPricing[pricingSlab.slabPricing.length - 1].discountPercentage}% OFF
            </span>
          </div>
          <div className="line-through text-[#595959] text-[12px]">
            {toINR(pricingSlab.listingPrice)}
          </div>
          <div className="font-semibold text-[#595959] text-[12px]">
            <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListItem3;
