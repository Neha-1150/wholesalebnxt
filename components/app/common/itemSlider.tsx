import Link from "next/link";
import ProductCarouselItem from "./ProductCarouselItem";

const ItemSlider = ({ title, seeMoreUrl, items, itemStyle }) => {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 whitespace-nowrap">{title && title}</h4>
        {seeMoreUrl && (
          <Link href={seeMoreUrl}>
            <a className="text-sm text-gray-700">See All</a>
          </Link>
        )}
      </div>
      <div className="flex my-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 m-3">
          {items?.map((i) => (
            <div className="" style={{minWidth: '80vw', ...itemStyle && itemStyle}} key={i?.id}>
              {i?.actionUri ? (
                <Link href={i?.actionUri}>
                  <a>
                    <img src={i?.itemUrl?.url} alt={i?.itemUrl?.name} />
                  </a>
                </Link>
              ) : (
                <img src={i?.itemUrl?.url} alt={i?.itemUrl?.name} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSlider;
