import Link from "next/link";
import ProductCarouselItem from "./ProductCarouselItem";

const MultiRowItemSlider = ({ title, seeMoreUrl, items1, items2 ,itemStyle }) => {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between px-3 mt-3">
        <h4 className="font-bold text-white whitespace-nowrap">{title && title}</h4>
        {seeMoreUrl && (
          <Link href={seeMoreUrl}>
            <a className="text-sm text-gray-700">See All</a>
          </Link>
        )}
      </div>
      <div className="flex flex-col my-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 m-3">
          {items1?.map((i) => (
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
        <div className="flex gap-3 m-3">
          {items2?.map((i) => (
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

export default MultiRowItemSlider;
