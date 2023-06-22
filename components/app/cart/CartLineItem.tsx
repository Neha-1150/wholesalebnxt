import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { XIcon } from "@heroicons/react/solid";
import QtyInput from "../common/QtyInput";
import { getQtyByProductId, pluralize, toINR } from "../../../utilities";
import { REMOVE_FROM_CART, UPDATE_CART } from "../../../store/actions";
import { useState } from "react";
import { useSession } from "next-auth/client";

const CartLineItem = ({ item }) => {
  let { product, selectedAddOns } = item;
  const dispatch = useDispatch();
  const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);
  const { theme } = useTheme();
  const session = useSession();

  const [itemQty, setItemQty] = useState(item.quantity);
  const [currentRate, setCurrentRate] = useState(item.productRate);


  const removeFromCartHandler = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: {
        productId: item?.product?._id,
      },
    });
    toast.success(`${item?.product?.name} removed from cart`);
  };


  const updateQty = (mode) => {
    let updatedQty = 0;

    if (mode == "add") {
      if((itemQty) != parseInt(product.salesPricing.availableInventory)){
      updatedQty = itemQty + product.stepquantity;
      }
    } else {
      if (itemQty != product.MOQ) {
        updatedQty = itemQty - product.stepquantity;
      }
    }
    
    if (updatedQty >= product.MOQ) {
      setItemQty(updatedQty);
      let tempRate = product.salesPricing.slabPricing.reduce((acc, cur) => {
        if (updatedQty >= cur.slabStart && updatedQty <= cur.slabEnding) {
          acc = cur.rate;
        }
        return acc;
      }, 0)


      setCurrentRate(tempRate);

      dispatch({
        type: UPDATE_CART,
        payload: {
          product,
          updatedQuantity: updatedQty,
          updateType: "add",
          session,
          productRate: tempRate,
          selectedAddOns: selectedAddOns
        },
      });
    }
  };

  return (
    <>
      <div className="w-full py-3 border-b-[0.5px] border-[#c4c4c4] bg-white dark:bg-gradient-to-br dark:from-darkColor-900 dark:to-black dark:border-darkColor-900 border-darkColor-50">
        <div className="flex w-full space-x-3 mb-3">
          <div className="relative">
            <img src={item?.product?.thumbnail} alt={item?.product?.title} width={200} height={200} className="object-contain w-32 h-full border rounded-md dark:border-darkColor-900" />
          </div>

          <div className="w-full">
            <div className="flex flex-col space-y-2">
              <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">{item?.product?.name}</div>
              {selectedAddOns && selectedAddOns.length > 0 && <div className="max-w-[60vw] text-[14px] leading-snug text-[#595959] dark:text-darkColor-100">+ {selectedAddOns.map((a) => a.name)} </div>}

              <div className="flex justify-between items-center w-full mt-2 text-sm text-darkColor-700 dark:text-darkColor-50">
                <div className="flex flex-col gap-1 font-medium">
                  <div className="flex flex-col gap-0 text-sm">
                    <div className="text-brand-600 text-[20px] font-bold">{toINR((currentRate * itemQty).toFixed(2))}</div>
                  </div>

                  <div className="text-[12px] flex gap-2">
                    <div className="text-[#7b7b7b] font-semibold">{toINR((currentRate / (2000 * itemQty)).toFixed(2))}/unit</div>
                  </div>

                  {!item.product.salesPricing.trackInventory ? 

                    <div className="bg-gray-200 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Subject to availability</div>
                    :
                    item.product.salesPricing.inventoryStatus != "OutOfStock" ? (
                      <div className="bg-green-100 p-2 py-1 text-green-800 text-[12px] font-bold rounded-full flex justify-center items-center">
                        Available : {item.product.salesPricing.availableInventory} {item.product.salesPricing.availableInventory > 1 ? pluralize(item.product?.unit) : item.product?.unit}
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-800 p-2 py-1 text-[12px] rounded-full font-semibold flex justify-center items-center">Out Of Stock</div>
                    )
                }

                  <div className="font-semibold text-[#595959] text-[12px]">
                    <span className="font-medium">{product?.MOQ}</span> {product?.MOQ > 1 ? pluralize(product?.unit) : product?.unit} minimum order
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  {product?.status === "outOfStock" ? (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:text-red-100 dark:bg-red-500/30">Out of Stock</span>
                    </div>
                  ) : (
                    <div className="relative border rounded-full z-0 m-0 border-black-700 border-2 w-[150px]">
                      <button className="absolute left-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-l-full" type="button" onClick={(e) => updateQty("subtract")}>
                        -
                      </button>

                      <div className="flex items-center justify-center px-1 py-2 mx-3 my-0 font-semibold text-black-700 text-center border-transparent border-box dark:bg-transparent focus:outline-none focus:ring-0">{itemQty}</div>

                      <button className="absolute right-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-black-700 rounded-r-full" type="button" onClick={(e) => updateQty("add")}>
                        +
                      </button>
                    </div>
                  )}
                  <button className="border border-lg p-3 py-2 rounded" onClick={() => removeFromCartHandler()}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartLineItem;
