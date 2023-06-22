import axios from "axios";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChartBarIcon, CheckIcon } from "@heroicons/react/solid";
import QtyInput from "../common/QtyInput";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { getQtyByProductId, pluralize, toINR } from "../../../utilities";
import { REMOVE_FROM_CART, UPDATE_CART } from "../../../store/actions";
import { AiFillCaretDown } from "react-icons/ai";
import insightsClient from "search-insights";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import moment from "moment";
import Countdown, { zeroPad } from "react-countdown";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { tagsColor } from "../../../utilities/common";

let superProducts = [1];

const ProductListItem2 = ({ product, selectedCategory, uid, page }) => {
  console.log(product);
  const appId = "VXW45ZDJ47";
  const apiKey = "bdbf648eeb26a9336cda8e71aaf8f32c";
  insightsClient("init", { appId, apiKey, useCookie: true });
  const router = useRouter();
  const [session] = useSession();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const lineItems = useSelector((state) => state.lineItems);

  const { theme } = useTheme();
  const [showQtySelector, setShowQtySelector] = useState(false);

  const [selectedAddons, setSelectedAddons] = useState(new Array(product.product_add_ons ? product.product_add_ons.length : 1).fill(true));
  const [totalItemValue, setTotalItemValue] = useState(product?.discountedPrice + product?.product_add_ons ? product?.product_add_ons[0]?.rate : 0);
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    if (getQtyByProductId(lineItems, product?.id, 0) > 0) {
      setShowQtySelector(true);
    } else {
      setShowQtySelector(false);
    }
  }, [lineItems, selectedCategory]);

  const addToCartHandler1 = async (e) => {
    e.stopPropagation();
    let session = await getSession();

    if (session?.user?.defaultCity == "Nagpur") {
      toast("Dear Customer,\n\nWe are yet to start our order operations in this city. We will be notifying you once we are ready to serve you!\n Thank you for chosing us.", {
        duration: 4000,
      });
    } else {
      addToCartHandler(e);
    }
  };

  const addToCartHandler = (e) => {
    e.stopPropagation();

    if (product.product_add_ons) {
      dispatch({
        type: UPDATE_CART,
        payload: {
          product,
          updatedQuantity: product?.moq || 500,
          updateType: "add",
          selectedAddOns: product.product_add_ons.filter((a, i) => selectedAddons[i]),
          session: session,
        },
      });

      setOpen(true);
    } else {
      dispatch({
        type: UPDATE_CART,
        payload: {
          product,
          updatedQuantity: product?.moq || 500,
          updateType: "add",
          session: session,
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
    }
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
    return (
      <div className="flex flex-col gap-1 font-medium">
        <div className="flex flex-col gap-0 text-sm">
          <div className="flex">
            <div className="text-brand-600 text-[18px] font-bold">
              {toINR(product?.pricing[0].slabPricing[product?.pricing[0].slabPricing.length - 1].listingRate)}/{product?.unit}
            </div>
          </div>
        </div>

        {product.inventorystatus != "outOfStock" && product?.pricing[0].inventory > 0 ? (
          <div className="bg-[#6553E6] p-2 py-1 text-white text-[10px] rounded-full font-semibold flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="ml-1">
              Available : {product?.pricing[0].inventory} {product?.pricing[0].inventory > 1 ? pluralize(product?.unit) : product?.unit}
            </span>
          </div>
        ): (<div className="mt-1">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:text-red-100 dark:bg-red-500/30">Out of Stock</span>
      </div>)}

          <div className="font-semibold text-[#595959] text-[12px]">
            <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
          </div>

      </div>
    );
  };

  const renderAddBtn = () => {
    return (
      <button className="px-4 py-1 font-semibold text-green-700 border-2 border-green-700 rounded-full bg-none w-[100%]" onClick={(e) => addToCartHandler1(e)} type="button">
        add +
      </button>
    );
  };

  const handelAddOnChange = (index) => {
    const updatedAddons = selectedAddons.map((item, i) => (i === index ? !item : item));

    setSelectedAddons(updatedAddons);

    const totalPrice = updatedAddons.reduce((sum, currentState, index) => {
      if (currentState === true) {
        return sum + product?.product_add_ons[index].rate;
      }
      return sum;
    }, 0);
    setTotalItemValue((totalPrice + product.discountedPrice) * selectedQty);
    dispatch({
      type: UPDATE_CART,
      payload: {
        product,
        updatedQuantity: selectedQty,
        updateType: "add",
        session: session,
      },
    });
  };

  useEffect(() => {
    if (product?.product_add_ons) {
      const totalPrice = selectedAddons.reduce((sum, currentState, index) => {
        if (currentState === true) {
          return sum + product?.product_add_ons[index].rate;
        }
        return sum;
      }, 0);
      setTotalItemValue((totalPrice + product.discountedPrice) * selectedQty);
    }
  }, [selectedQty]);

  return (
    <>
      <div onClick={() => openProduct()} key={product?.id} className="w-full p-3  border-b-[0.5px] border-[#c4c4c4] bg-white dark:bg-gradient-to-br dark:from-darkColor-900 dark:to-black dark:border-darkColor-900">
        <div className="flex justify-between w-full">
          <div className="relative w-32 h-32 mr-2">
            <img src={product.thumbnail} alt={product?.name} width={250} height={250} className="object-contain w-32 h-32 border border-[#c4c4c4] rounded-md dark:border-darkColor-900" />
            {parseFloat(product?.discountPercentage) > 0 ? (
              <div className="absolute top-[4px] left-[4px] px-2 pt-0.5 text-[10px] text-white bg-[#E64430] rounded-full">
                <span className="font-bold">{product?.discountPercentage}%</span> <b>OFF</b>
              </div>
            ) : null}
          </div>

          <div className="w-full text-xs">
            <div className="flex flex-col h-full min-w-full mb-2">
              <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">{product?.name}</div>

              {/* {product?.otherAttributes?.["tags"]?.length > 0 && (
                <div className="flex items-center">
                 {product?.otherAttributes?.["tags"]?.map((stat, index) => (
                      <div key={index} style={{ backgroundColor: tagsColor(stat) }} className={`${index == 0 ? 'mr-1' : 'mx-1'} p-1 px-2 text-white rounded-sm`}>
                        {stat}
                      </div>
                    ))}
                </div>
              )} */}

              <div className="flex justify-between items-end w-full mt-2 text-sm text-darkColor-700 dark:text-darkColor-50">
                {renderProductPricing()}

                <div className="flex flex-col items-center">
                  {product?.inventorystatus === "inStock" && (
                    <div className="flex items-center justify-between mt-1">
                      {showQtySelector ? (
                        <>
                          <div className="w-[100px]">{product.product_add_ons && product.product_add_ons.length > 0 ? <QtyInput key={product?.id} step={product?.stepQty} min={product?.moq} product={product} addOns={product.product_add_ons.filter((a, i) => selectedAddons[i])} cb={(q) => setSelectedQty(q)} /> : <QtyInput key={product?.id} step={product?.stepQty} min={product?.moq} product={product} />}</div>
                        </>
                      ) : (
                        <div className="w-[100px]">{renderAddBtn()}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {typeof product?.vendor == "string" && (
          <div>
            {product.trackInventory && product.status != "outOfStock" && product.inventory > 0 ? (
              <div className="text-[12px] flex justify-between mt-2  justify-self-end dark:text-darkColor-400 dark:border-darkColor-700 text-darkColor-600">
                <div>
                  Sold by <strong>{product?.vendor}</strong>
                </div>
                {/* <div>Fastest Delivery : <strong>Tomorrow</strong></div> */}
              </div>
            ) : (
              <div className="text-[12px] flex mt-2 justify-between justify-self-end dark:text-darkColor-400 dark:border-darkColor-700 text-darkColor-600">
                <div>
                  Sold by <strong>{product?.vendor}</strong>
                </div>
                {/* <div>Delivery between <strong>April 12 - April 16</strong></div> */}
              </div>
            )}
          </div>
        )}
      </div>

      {product.product_add_ons && product.product_add_ons.length > 0 && (
        <BottomSheet open={open} onDismiss={() => setOpen(false)}>
          <div className="m-3 mx-5">
            <div className="flex mb-5">
              <CheckIcon className="w-4 h-4 mr-1.5 text-brand-500" />
              <div>Complete your product with Addons</div>
            </div>

            {product.product_add_ons.map((a, i) => (
              <div className="flex justify-between items-center w-full">
                <label className="w-100" for={`addon-${i}`}>
                  <div className="flex justify-between items-center w-full">
                    <div className="relative w-24 h-24 mr-2">
                      <img src={a?.media[0]?.url} alt={a?.title} width={250} height={250} className="object-contain w-24 h-24 border border-[#c4c4c4] rounded-md dark:border-darkColor-900" />
                    </div>

                    <div className="w-full text-xs">
                      <div className="flex flex-col h-full min-w-full mb-2">
                        <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">{a?.title}</div>
                        <div className="flex mt-2">
                          <div className="text-darkColor-600 text-[18px] font-semibold">
                            {toINR(a?.rate?.toFixed(2))}/{a?.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                <div>
                  <input checked={selectedAddons[i]} onChange={() => handelAddOnChange(i)} className="w-6 h-6 text-green-700" type="checkbox" id={`addon-${i}`} value={a?.id} />
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center w-100 border-t-2 mt-3 pt-3">
              <div className="text-brand-600 text-[18px] font-semibold">{toINR(totalItemValue?.toFixed(2))}</div>
              <div className="w-[100px]">
                {showQtySelector ? (
                  <>
                    <div className="w-[100px]">
                      <QtyInput key={product?.id} step={product?.stepQty} min={product?.moq} product={product} addOns={product.product_add_ons.filter((a, i) => selectedAddons[i])} cb={(q) => setSelectedQty(q)} />
                    </div>
                  </>
                ) : (
                  <div className="w-[100px]">{renderAddBtn()}</div>
                )}
              </div>
            </div>
            <div onClick={() => setOpen(false)} className="flex justify-center w-100 bg-green-800 m-2 p-3 mt-4 rounded-md text-white">
              Submit
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

export default ProductListItem2;
