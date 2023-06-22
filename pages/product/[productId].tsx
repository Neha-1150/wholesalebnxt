import * as React from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import insightsClient from "search-insights";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import { useDispatch, useSelector } from "react-redux";
import QtyInput from "../../components/app/common/QtyInput";
import ProductCarousel from "../../components/app/common/ProductCarousel";
import BackWithSearchLayout from "../../components/app/layouts/BackWithSearchLayout";
import { getQtyByProductId, pluralize, toINR } from "../../utilities";
import { SET_RECENTLY_VIEWED, UPDATE_CART } from "../../store/actions";
import ContinueToCart from "../../components/app/cart/ContinueToCart";
import recombee from "recombee-js-api-client/src";
import { BottomSheet } from "react-spring-bottom-sheet";
import { ChartBarIcon, CheckIcon } from "@heroicons/react/solid";
import "react-spring-bottom-sheet/dist/style.css";
import Navbar from "../../components/app/common/Navbar2";

const recombeeDb = "bnxt-new";
const recombeeApiKey = "66Aa0NmUR7Ek9vQyaAWN7nKKtfZej93q2B3CMkuniHFEKckeonTpqxkKKtmN08CI";
const recombeeClient = new recombee.ApiClient(recombeeDb, recombeeApiKey, { region: "ca-east" });

const ProductPage = ({ product, session }) => {
  product = { ...product, addOns: !product.addOns ? null : product.addOns };
  // console.log(product);

  const appId = "VXW45ZDJ47";
  const apiKey = "bdbf648eeb26a9336cda8e71aaf8f32c";
  insightsClient("init", { appId, apiKey, useCookie: true });
  const router = useRouter();

  const dispatch = useDispatch();
  // const lineItems = useSelector((state) => state.lineItems);

  const [selectedAddons, setSelectedAddons] = useState<any>();
  const [itemQty, setItemQty] = useState(product?.MOQ);
  const [addOnItemQty, setAddOnItemQty] = useState(product?.addOns?.MOQ);
  const [currentRate, setCurrentRate] = useState(product?.salesPricing?.slabPricing[0]?.rate);

  // useEffect(() => {
  //   global.analytics.track("Product Viewed", {
  //     itemId: product?._id,
  //     item: product,
  //   });
  //   recombeeClient.send(new recombee.AddDetailView(session.user.id, product?._id, { cascadeCreate: true } ));

  //   // dispatch({
  //   //   type: SET_RECENTLY_VIEWED,
  //   //   payload: product,
  //   // });

  // }, []);

  useEffect(() => {
    let temp = product.salesPricing.slabPricing.reduce((acc, cur) => {
      if (itemQty >= cur.slabStart && itemQty <= cur.slabEnding) {
        acc = cur.rate;
      }
      return acc;
    }, 0);

    if (selectedAddons) {
      temp += selectedAddons.salesPricing.slabPricing[0].rate;
    }

    setCurrentRate(temp);

    return () => {
      setCurrentRate();
    };
  }, [itemQty]);

  const updateQty = (mode) => {
    let updatedQty = 0;

    if (mode == "add") {
      if(!product.salesPricing.trackInventory){
        updatedQty = itemQty + product.stepquantity;
      }else if (itemQty != parseInt(product.salesPricing.availableInventory)) {
        updatedQty = itemQty + product.stepquantity;
      }
    } else {
      if (itemQty != product.MOQ) {
        updatedQty = itemQty - product.stepquantity;
      }
    }

    if (updatedQty >= product.MOQ) {
      setItemQty(updatedQty);
    }
    if ( product?.addOns && updatedQty >= product.addOns.MOQ && updateQty <= parseInt(product.addOns.salesPricing.availableInventory)) {
      setAddOnItemQty(updatedQty);
    }
  };

  const updateAddOnQty = (mode) => {
    let updatedQty = 0;

    if (mode == "add") {
      if (addOnItemQty != parseInt(product.addOns.salesPricing.availableInventory)) {
        updatedQty = addOnItemQty + product.addOns.stepquantity;
      }
    } else {
      if (addOnItemQty != product.MOQ) {
        updatedQty = addOnItemQty - product.addOns.stepquantity;
      }
    }

    if (updatedQty >= product.addOns.MOQ) {
      setAddOnItemQty(updatedQty);
    }
  };

  const addToCartHandler = () => {
    if (product.salesPricing.trackInventory && itemQty > product.salesPricing.availableInventory) {
      toast.error(`Only ${product.salesPricing.availableInventory} ${product.salesPricing.availableInventory > 1 ? pluralize(product?.unit) : product?.unit} available`);
      return;
    }
    dispatch({
      type: UPDATE_CART,
      payload: {
        product,
        updatedQuantity: itemQty,
        updateType: "add",
        session,
        productRate: currentRate,
        selectedAddOns: selectedAddons && [
          {
            ...selectedAddons,
            wnxt_product: product.sku,
            rate: selectedAddons?.salesPricing.slabPricing[0].listingRate,
          },
        ],
        trackInventory: product.salesPricing.trackInventory
      },
    });
    toast.success(`Added to cart`);
  };

  const handelAddOn = (action, addOn) => {
    if (action) {
      setSelectedAddons(addOn);

      dispatch({
        type: UPDATE_CART,
        payload: {
          product: product,
          updatedQuantity: itemQty,
          updateType: "add",
          session,
          productRate: currentRate,
          trackInventory: product.salesPricing.trackInventory
        },
      });

      dispatch({
        type: UPDATE_CART,
        payload: {
          product: addOn,
          updatedQuantity: addOnItemQty,
          updateType: "add",
          session,
          productRate: addOn?.salesPricing.slabPricing[0].rate,
          trackInventory: addOn.salesPricing.trackInventory
        },
      });
    } else {
      setSelectedAddons();
    }
  };

  const productBadges = (t) => {
    switch (t) {
      case "Recyclable":
        return "/assets/badges/recyclable.png";

      case "Compostable":
        return "/assets/badges/compostable.png";

      case "Sustainable":
        return "/assets/badges/sustainable.png";

      case "Eco Friendly":
        return "/assets/badges/ecoFriendly.png";

      default:
        return "/assets/badges/recyclable.png";
    }
  };

  return (
    <BackWithSearchLayout className={" "} backTitle={""}>
      <div className="px-2">
        {/* Image */}
        <div className="relative pb-1">
          <img src={product?.media?.[0]} alt={product?.name} />
        </div>

        <div className="w-full text-xs px-2 py-4 border-t-[0.5px] border-b-[0.5px]">
          <div className="flex flex-col h-full min-w-full mb-2">
            <div className="text-[10px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">SKU ID: #{product.sku}</div>
            <div className="text-[15px] font-bold leading-snug text-[#292929] dark:text-darkColor-100">{product?.name}</div>
          </div>

          {product?.tags && product.tags.length > 0 && (
            <div className="grid grid-cols-2 gap-2 my-4">
              {product.tags.map((t) => (
                <div className="flex items-center">
                  <img width={20} src={productBadges(t)} />
                  <div className="ml-2">{t}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-end w-full mt-2 text-sm text-darkColor-700 dark:text-darkColor-50">
            <div className="flex flex-col gap-1 font-medium">
              <div className="flex gap-0 text-sm">
                <div className="text-brand-600 text-[20px] font-bold">{toINR((currentRate * itemQty).toFixed(2))}</div>
                <div className="text-[#7b7b7b] ml-2 text-[12px] line-through font-semibold">{toINR((product?.salesPricing?.listingPrice * itemQty)?.toFixed(2))}</div>
              </div>

              <div className="text-[12px] flex gap-2">
                {/* <div className="text-[#7b7b7b] font-semibold">{toINR((currentRate / (2000 * itemQty)).toFixed(2))}/unit</div> */}
              </div>

              {!product.salesPricing?.trackInventory ? 
                      <div className="bg-gray-200 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Subject to availability</div>
                      :
                      product.salesPricing.inventoryStatus != "OutOfStock" ? (
                        <div style={{ width: 'fit-content' }} className="w-fit mt-1 bg-green-100 p-2 py-1 text-green-800 text-[12px] font-bold rounded-full flex justify-center items-center">
                          Available : {product?.salesPricing.availableInventory} {product?.salesPricing.availableInventory > 1 ? pluralize(product?.unit) : product?.unit}
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-800 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Out Of Stock</div>
                      )
                    }
            </div>

            <div className="flex flex-col items-center">
              {(!product.salesPricing.trackInventory || product.salesPricing.inventoryStatus == "InStock") && (
                <>
                  <div className="font-semibold text-[#595959] text-[12px]">
                    <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="relative border rounded-full z-0 m-0 border-black-700 border-2 w-[150px]">
                      <button className="absolute left-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-l-full" type="button" onClick={(e) => updateQty("subtract")}>
                        -
                      </button>

                      <div className="flex items-center justify-center px-1 py-2 mx-3 my-0 font-semibold text-black-700 text-center border-transparent border-box dark:bg-transparent focus:outline-none focus:ring-0">{itemQty}</div>

                      <button className="absolute right-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-r-full" type="button" onClick={(e) => updateQty("add")}>
                        +
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full text-xs px-2 py-4 border-b-[0.5px]">
          <div className="text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">Get % discount on Bulk Orders!!</div>
          <div className="mt-3">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border p-2">Select</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Discount</th>
                  <th className="border p-2">Per {product.unit}</th>
                </tr>
              </thead>
              <tbody>
                {product.salesPricing.slabPricing.map((p) => (
                  <tr className="text-center">
                    <td className="border p-2">
                      <input checked={itemQty >= p.slabStart && itemQty <= p.slabEnding ? true : false} value={p.slabStart} type="radio" name={product._id} onChange={(e) => setItemQty(parseInt(e.target.value))}></input>
                    </td>
                    <td className="border p-2">
                      {p.slabStart} {p.slabEnding == 88888 ? "+" : "- " + p.slabEnding}
                    </td>
                    <td className="border p-2 font-bold text-green-500">{p.discountPercentage}%</td>
                    <td className="border p-2">{toINR(p.rate.toFixed(2))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!product.salesPricing.trackInventory || product.salesPricing.inventoryStatus == "InStock") && (
          <div className="w-full flex p-4 border-b-[0.5px]">
            <button className="font-bold bg-brand-500 flex-1 text-white border border-brand-500 border-2 p-2 rounded-lg text-sm" onClick={() => addToCartHandler()}>
              Add to Cart
            </button>
          </div>
        )}

        {product?.addOns && (
          <div className="text-xs border m-2">
            <div className="text-[14px] p-2 border-b mb-2 font-bold leading-snug text-[#595959] dark:text-darkColor-100">Buy it with</div>
            <div className="flex items-center p-2  border-b ">
              <div className="flex justify-between items-center w-full">
                <div className="relative w-20 h-20 mr-2">
                  <img src={product?.addOns?.thumbnail} alt={product?.addOns?.name} width={250} height={250} className="object-contain w-18 h-18 border border-[#c4c4c4] rounded-md dark:border-darkColor-900" />
                </div>

                <div className="w-full text-xs flex items-center">
                  <div className="flex flex-1 flex-col h-full mb-2">
                    <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">{product?.addOns?.name}</div>
                    <div className="flex mt-1">
                      <div className="text-brand-600 text-[14px] font-semibold">
                        {toINR(product?.addOns?.salesPricing.slabPricing[0].rate)} per {product?.addOns?.unit}
                      </div>
                    </div>

                    {!product.salesPricing.trackInventory ? 
                      <div className="bg-gray-200 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Subject to availability</div>
                      :
                      product.salesPricing.inventoryStatus != "OutOfStock" ? (
                        <div style={{ width: 'fit-content' }} className="w-fit mt-1 bg-green-100 p-2 py-1 text-green-800 text-[12px] font-bold rounded-full flex justify-center items-center">
                          Available : {product?.addOns?.salesPricing.availableInventory} {product?.addOns?.salesPricing.availableInventory > 1 ? pluralize(product?.addOns?.unit) : product?.addOns?.unit}
                        </div>
                      ) : (
                        <div className="bg-red-100 text-red-800 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Out Of Stock</div>
                      )
                    }
                    
                  </div>
                  <div className="flex flex-col items-center">
                  {(!product.addOns.salesPricing.trackInventory || product.addOns.salesPricing.inventoryStatus == "InStock") && (
                      <>
                        <div className="font-semibold text-[#595959] text-[12px]">
                          <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="relative border rounded-full z-0 m-0 border-black-700 border-2 w-[150px]">
                            <button className="absolute left-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-l-full" type="button" onClick={(e) => updateAddOnQty("subtract")}>
                              -
                            </button>

                            <div className="flex items-center justify-center px-1 py-2 mx-3 my-0 font-semibold text-black-700 text-center border-transparent border-box dark:bg-transparent focus:outline-none focus:ring-0">{addOnItemQty}</div>

                            <button className="absolute right-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-r-full" type="button" onClick={(e) => updateAddOnQty("add")}>
                              +
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2">
              <div className="flex w-3/5 justify-between items-center">
                <div className="flex-col">
                  <div className="font-semibold text-[#595959] text-[12px]">1 Item</div>
                  <div className="text-[#414141] text-[16px] font-bold">{toINR((currentRate * itemQty).toFixed(2))}</div>
                </div>
                <div className="flex-col">
                  <div className="font-semibold text-[#595959] text-[16px]">+</div>
                </div>
                <div className="flex-col">
                  <div className="font-semibold text-[#595959] text-[12px]">1 AddOn</div>
                  <div className="text-[#414141] text-[16px] font-bold">{toINR(product?.addOns?.salesPricing.slabPricing[0].rate * addOnItemQty)}</div>
                </div>
                <div className="flex-col">
                  <div className="font-semibold text-[#595959] text-[16px]">=</div>
                </div>
                <div className="flex-col">
                  <div className="font-semibold text-[#595959] text-[12px]">Total</div>
                  <div className="text-[#414141] text-[16px] font-bold">{toINR(((currentRate * itemQty) + (product?.addOns?.salesPricing.slabPricing[0].rate * addOnItemQty)).toFixed(2))}</div>
                </div>
              </div>
              <button onClick={() => handelAddOn(true,product?.addOns)} className="text-brand-500 border border-brand-500 border-2 px-4 py-1 rounded-lg text-sm">
                Add 2 Items
              </button>
            </div>
          </div>
        )}

        {/* <ProductCarousel products={product?.relatedProducts} title="Similar Products" /> */}
      </div>

      {/* <ContinueToCart positionClassName="bottom-[20px]" /> */}

      <Navbar />
    </BackWithSearchLayout>
  );
};

export default ProductPage;

export const getServerSideProps = async (ctx) => {
  const { productId } = ctx.params;

  const session = await getSession({ req: ctx.req });

  if (!session) {
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();
    return;
  }

  try {
    const city = session && session.user ? session?.user?.defaultCity : null;
    const res = await axios.get(`${process.env.PRODUCTS_SERVICE_URL}/product/${productId}/${city}`);
    if (res?.status === 200) {
      return {
        props: {
          product: res.data.result,
          session,
        },
      };
    } else {
      return {
        props: {
          product: {},
          session,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      props: {
        product: {},
        session: null,
      },
    };
  }
};
