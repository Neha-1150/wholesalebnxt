import axios from "axios";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChartBarIcon } from "@heroicons/react/solid";
import QtyInput from "../common/QtyInput";
import _ from "lodash";
import { useSelector, useDispatch, RootStateOrAny } from "react-redux";
import { getQtyByProductId, pluralize, toINR } from "../../../utilities";
import { REMOVE_FROM_CART, UPDATE_CART } from "../../../store/actions";
import { AiFillCaretDown } from "react-icons/ai";
import insightsClient from "search-insights";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import moment from "moment";
import Countdown, { zeroPad } from 'react-countdown';


let superProducts = [1];

const ProductListItem = ({ product, selectedCategory, uid, page }) => {
  const appId = "VXW45ZDJ47";
  const apiKey = "bdbf648eeb26a9336cda8e71aaf8f32c";
  insightsClient("init", { appId, apiKey, useCookie: true });
  const router = useRouter();
  const [session] = useSession();

  const dispatch = useDispatch();
  const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);

  const { theme } = useTheme();
  const [showQtySelector, setShowQtySelector] = useState(false);

  let priceType = "Normal";

  if (product?.offerStartDateTime && product?.offerEndDateTime && page == 'offers') {
    priceType = "offer";
  } else if (product?.discountedPrice && product?.discountedPrice > 0) {
    priceType = "discounted";
  }

  useEffect(() => {
    if (getQtyByProductId(lineItems, product?.id, 0) > 0) {
      setShowQtySelector(true);
    } else {
      setShowQtySelector(false);
    }
  }, [lineItems, selectedCategory]);

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

  const removeFromCartHandler = () => {
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

  const renderProductPricing = () => {
    switch (priceType) {
      case "Normal":
        return (
          <div className="flex flex-col gap-1 font-medium">
            <div>
              {toINR(product?.rate?.toFixed(2))}/{product?.unit}
            </div>
            {product?.perPackUnit && <div className="text-[12px]">{toINR((product?.rate / product?.perPackUnit).toFixed(2))}/unit</div>}
          </div>
        );

      case "discounted":
        return (
          <div className="flex flex-col gap-1 font-medium">
            <div className="flex flex-col gap-0 text-sm">
              <div className="flex">
                <div className="text-brand-600 text-[18px]">
                  {toINR(product?.discountedPrice?.toFixed(2))}/{product?.unit}
                </div>
                
                {product.id%10 == 1 && <div className="flex items-center ml-2 text-[10px]"> <img className="mr-1" src="/meta/favicon.ico" width={16}/> Fulfilled</div>}

              </div>
              <div className="line-through text-[12px] text-gray-500">
                {toINR(product?.rate?.toFixed(2))}/{product?.unit}
              </div>
            </div>
            {product?.perPackUnit && product?.discountedPrice && (
              <div className="text-[12px] flex gap-2">
                <div className="text-brand-600 font-bold">{toINR((product?.discountedPrice / product?.perPackUnit).toFixed(2))}/unit</div>
                <div className="line-through text-[10px] text-gray-500">{toINR((product?.rate / product?.perPackUnit).toFixed(2))}/unit</div>
              </div>
            )}


            {product.trackInventory && product.status != 'outOfStock' && product.inventory > 0 && (
            <div>
              Available: {product.inventory} {product.inventory > 1 ? pluralize(product?.unit) : product?.unit}
            </div>
            )}


          </div>
        );

      case "offer":
        return (
          <div className="flex flex-col gap-1 font-medium">
            <div className="flex flex-col gap-0 text-sm">
              <div className="text-brand-600">
                <span className="text-xs mr-2">OFFER PRICE</span>
                {toINR(product?.discountedPrice?.toFixed(2))}/{product?.unit}
              </div>
              <div className="line-through text-[12px]">
                {toINR(product?.rate?.toFixed(2))}/{product?.unit}
              </div>
            </div>
            {product?.perPackUnit && product?.dealPrice && (
              <div className="text-[12px] flex gap-2">
                <div className="text-brand-600">{toINR((product?.discountedPrice / product?.perPackUnit).toFixed(2))}/unit</div>
                <div className="line-through">{toINR((product?.rate / product?.perPackUnit).toFixed(2))}/unit</div>
              </div>
            )}
          </div>
        );

      default:
        break;
    }
  };

  const renderAddBtn = () => {
    switch (priceType) {
      case "Normal":
        return (
          <button className="px-4 py-1 font-semibold text-white rounded-md shadow-md bg-brand-500" onClick={(e) => addToCartHandler(e)} type="button">
            ADD
          </button>
        );

      case "discounted":
        return (
          <button className="px-4 py-1 font-semibold text-white rounded-md shadow-md bg-brand-500" onClick={(e) => addToCartHandler(e)} type="button">
            ADD
          </button>
        );

      case "offer":
        if (moment(product.offerStartDateTime).isBefore() && moment().isBefore(product.offerEndDateTime)) {
          return (
            <button className="px-4 py-1 font-semibold text-white rounded-md shadow-md bg-brand-500" onClick={(e) => addToCartHandler(e)} type="button">
              ADD
            </button>
          );
        }
        if (moment(product.offerEndDateTime).isBefore()) {
          return (
            <button disabled className="px-4 py-1 font-semibold text-white rounded-md shadow-md bg-brand-500" type="button">
              Deal Ended
            </button>
          );
        }
        if (moment(product.offerStartDateTime).isAfter()) {
          return (
            <button disabled className="px-4 py-1 font-semibold text-white rounded-md shadow-md bg-brand-500" type="button">
              Starts In <Countdown date={product.offerStartDateTime} zeroPadTime={2} zeroPadDays={2} daysInHours={true}/>
            </button>
          );
        }

      default:
        break;
    }
  };

  return (
    <>
      <div onClick={() => openProduct()} key={product?.id} className="w-full p-3 border rounded-md shadow-md bg-coolGray-50 dark:bg-gradient-to-br dark:from-darkColor-900 dark:to-black dark:border-darkColor-900 border-darkColor-50">
        <div className="flex justify-between w-full">
          <div className="relative w-32 h-32 mr-2">
            <img src={product?.media?.[0]?.url ?? product?.media} alt={product?.title} width={200} height={200} className="object-contain w-32 h-32 border rounded-md dark:border-darkColor-900" />
            {parseFloat(product?.discountPercentage) > 0 ? (
              <div className="absolute top-[5px] left-[5px] px-1 pt-0.5 text-[10px] text-brand-600 bg-brand-50 rounded-full">
                <span className="font-bold">{product?.discountPercentage}%</span> off
              </div>
            ) : null}
          </div>
          <div className="w-full text-xs">
            <div className="flex flex-col h-full min-w-full mb-2">
              {product?.lastPriceDiff && parseInt(product?.lastPriceDiff) > 0 ? (
                <div className="mb-2">
                  <span className="px-2.5 py-1 text-green-700 bg-green-200 rounded-full">
                    Price down by <strong>{toINR(product?.lastPriceDiff?.toFixed(2))}</strong> <AiFillCaretDown className="inline w-4 h-4 mb-0.5" />
                  </span>
                </div>
              ) : null}

              <div className="max-w-[60vw] text-sm font-semibold leading-snug text-darkColor-800 dark:text-darkColor-100">{product?.title}</div>
              <div className="flex justify-between w-full mt-2 text-sm text-darkColor-700 dark:text-darkColor-50">
                {renderProductPricing()}

                <div className="flex flex-col items-end">
                  <div>
                    MOQ: <span className="font-medium">{product?.moq}</span> {product?.moq > 1 ? pluralize(product?.unit) : product?.unit}
                  </div>
                  {product?.status === "outOfStock" ? (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:text-red-100 dark:bg-red-500/30">Out of Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      {showQtySelector ? (
                        <>
                          <div className="w-24">
                            <QtyInput key={product?.id} step={product?.stepQty} min={product?.moq} product={product} />
                          </div>
                        </>
                      ) : (
                        <div className="">{renderAddBtn()}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {product?.otherAttributes?.["stats"]?.length > 0 && (
                <div className="mt-4">
                  <ul>
                    {product?.otherAttributes?.["stats"]?.map((stat, index) => (
                      <li key={index} className="flex dark:text-darkColor-200 text-darkColor-600">
                        <ChartBarIcon className="w-4 h-4 mr-1.5 text-brand-500" /> {stat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              

              {product?.id%10 == 0 ? (
                <div className="py-1 mt-auto border-t border-dashed justify-self-end dark:text-darkColor-400 dark:border-darkColor-700 text-darkColor-600">
                  <div>Sold by <strong>{product?.vendor}</strong></div>
                  <div>Delivery between <strong>April 12 - April 16</strong></div>
                </div>
              ): product?.vendor && (
                <div className="py-1 flex justify-between mt-auto border-t border-dashed justify-self-end dark:text-darkColor-400 dark:border-darkColor-700 text-darkColor-600">
                  <div>Sold by <strong>{product?.vendor}</strong></div>
                  <div>Get it as soon as <strong>Tomorrow</strong></div>
                </div>
              )}

			  {priceType == 'offer' && moment(product.offerStartDateTime).isBefore() && moment().isBefore(product.offerEndDateTime) && 
			  	<div className="text-gray-400">Offer Ends in <Countdown onComplete={() => window.location.reload()} date={product.offerEndDateTime} zeroPadTime={2} zeroPadDays={2} daysInHours={true}/></div>
			  }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListItem;
