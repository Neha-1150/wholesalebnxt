import toast from "react-hot-toast";
import insightsClient from "search-insights";
import { useEffect, useState } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { getQtyByProductId, pluralize, toINR, truncateLength } from "../../../utilities";
import { REMOVE_FROM_CART, UPDATE_CART } from "../../../store/actions";
import QtyInput from "./QtyInput";

let superProducts = [];

const ProductCarouselItem = ({ product }) => {
  const appId = "VXW45ZDJ47";
  const apiKey = "bdbf648eeb26a9336cda8e71aaf8f32c";
  insightsClient("init", { appId, apiKey, useCookie: true });
  const router = useRouter();
  const [session] = useSession();

  const dispatch = useDispatch();
  const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);

  const [showQtySelector, setShowQtySelector] = useState(false);

  useEffect(() => {
    if (getQtyByProductId(lineItems, product?.id, 0) > 0) {
      setShowQtySelector(true);
    } else {
      setShowQtySelector(false);
    }
  }, [lineItems]);

  const addToCartHandler = (e) => {
    e.stopPropagation();
    dispatch({
      type: UPDATE_CART,
      payload: {
        product,
        updatedQuantity: product?.moq || 500,
        updateType: "add",
      },
    });

    if (router && router.query.__queryId && router.query.__indexName) {
      insightsClient("convertedObjectIDsAfterSearch", {
        index: router.query.__indexName ? router.query.__indexName : "bnxtRetail",
        eventName: "ADDED TO CART",
        queryId: router.query.__queryId,
        objectIDs: [product.objectID],
        userToken: session?.user?.id.toString(),
      });
    } else {
      insightsClient("convertedObjectIDs", {
        index: "bnxtRetail",
        eventName: "ADDED TO CART",
        queryId: product?.__queryID,
        objectIDs: [product.objectID],
        userToken: session?.user?.id.toString(),
      });
    }

    toast.success(`${product?.title} added to cart`);
  };

  const removeFromCartHandler = (e) => {
    e.stopPropagation();
    dispatch({
      type: REMOVE_FROM_CART,
      payload: {
        productId: product.id,
      },
    });
    setShowQtySelector(false);
    toast.success(`${product?.title} removed from cart`);
  };

  const openProduct = () => {
    global.analytics.track("Product Clicked", {
      itemId: product.id,
      item: product,
    });
    router.push(`/product/${product.id}`);
    global.analytics.track("Product Clicked", {
      itemId: product?.id,
      item: product,
    });
  };

  return (
    <div className="w-[40vw] bg-white border rounded-sm" onClick={() => openProduct()}>
      {/* Image */}

      <div className="w-[40vw] relative p-2">
        <img src={product?.media?.[0].url} alt={product?.title} />
        {parseFloat(product?.discountPercentage) > 0 ? (
          <div className="absolute top-[5px] left-[5px] px-1 pt-0.5 text-[6px] text-brand-600 bg-brand-50 rounded-full">
            <span className="font-bold text-sm">{product?.discountPercentage}%</span> off
          </div>
        ) : null}
      </div>
      
      <div className="flex flex-col gap-2 mt-2 text-xs px-2">
        <p className="font-medium leading-tight" style={{ display: '-webkit-box', '-webkit-line-clamp': 3, '-webkit-box-orient': 'vertical' }}>{product?.title}</p>
        <div>
			<div className="text-brand-600">
			{toINR(product?.discountedPrice?.toFixed(2))}/{product?.unit}
			</div>
			<div className="line-through text-[12px]">
			{toINR(product?.rate?.toFixed(2))}/{product?.unit}
			</div>
		</div>
      </div>
      <button></button>
    </div>
  );
};

export default ProductCarouselItem;
