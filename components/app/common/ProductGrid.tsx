import axios from "axios";
import { useSession } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { pluralize, toINR } from "../../../utilities";
import { shimmer, toBase64 } from "../../../utilities/common";

function ProductGrid({ products, title, showMoreUri, background }) {
    const router = useRouter();
  return (
    <div className="px-3 py-3 bg-gradient-to-b from-cyan-500 to-blue-500 shadow" style={{ backgroundImage: `url('${background?.url}')`, backgroundPosition: 'right top', backgroundSize: 'cover' }}>
      <div className="my-2 text-xl mt-[20px]">{title}</div>
      <div className="grid grid-cols-2 gap-2 mt-[8px]">
        {products?.map((product) => {
          if(product){
            return <ProductGridItem productId={product} key={product} />;
          }else{
            return <div></div>
          }
        })}
      </div>
      {showMoreUri && showMoreUri != "" && (
        <div className="flex justify-center mt-3">
          <div onClick={() => router.push(showMoreUri)} className="text-sm underline">See more</div>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;

function ProductGridItem({ productId }) {
  const router = useRouter();
  const [product, setProduct] = useState()
  const [session] = useSession()

  useEffect(() => {
    getProduct()
  }, [])

  const getProduct = async() => {
    const res = await axios.get(`https://seashell-app-wb7wz.ondigitalocean.app/v1/product/${productId}/${session.user.defaultCity}`);
    if(res.status == 200){
      setProduct(res.data.result)
    }
  }
  
  if(!product){
    return <div>Loading...</div>
  }
  return (
    <div onClick={() => router.push(`/product/${product._id}`)} className="bg-white rounded-sm p-2 border">
      <div className="relative p-2">

      <Image alt={product?.name}src={product?.thumbnail && product?.thumbnail != '' ? product?.thumbnail : product.media[0]} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`} width={500} height={500} className="w-max h-[100%]"/>

        {/* <img src={product?.thumbnail} alt={product?.name} /> */}

        {product?.salesPricing?.inventoryStatus == "InStock" && product?.salesPricing?.availableInventory > 0 ?
        <div className="bg-green-100 p-2 py-1 text-green-800 text-[10px] font-bold absolute top-[5px] left-[5px] rounded-full flex justify-center items-center">
            Available : {product?.salesPricing?.availableInventory} {product?.salesPricing?.availableInventory > 1 ? pluralize(product?.unit) : product?.unit}
        </div>
        :
        <div className="bg-red-100 text-red-800 p-2 py-1 text-[10px] absolute top-[5px] left-[5px] rounded-full font-semibold flex justify-center items-center">
           Out Of Stock
        </div>
        }

      </div>

      <div className="flex flex-col gap-2 mt-2 text-xs">
        <p className="font-medium leading-tight" style={{ display: "-webkit-box", "-webkit-line-clamp": 3, "-webkit-box-orient": "vertical" }}>
          {product?.name}
        </p>
        <div>
          {/* <div className="text-brand-600 font-bold">
            {toINR(product?.salesPricing?.slabPricing[product?.salesPricing?.slabPricing?.length - 1]?.listingRate)} Per {product?.unit}
          </div>
          <div>
            
          </div> */}
          <div className="text-brand-600 text-sm font-bold">
            {toINR(product?.salesPricing?.slabPricing[product?.salesPricing?.slabPricing?.length - 1]?.rate)} Per {product?.unit}
          </div>
          <div className="font-semibold text-[#595959] text-[12px]">
            <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
          </div>
        </div>
      </div>
    </div>
  );
}
