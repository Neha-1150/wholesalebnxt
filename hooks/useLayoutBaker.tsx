import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCarousel from '../components/app/common/ProductCarousel';
import { getSession } from 'next-auth/client';
import CountDownBanner from '../components/app/home/CountDownBanner';
import moment from 'moment';
import ItemSlider from '../components/app/common/itemSlider';
import Lottie from 'react-lottie';
import ProductGrid from '../components/app/common/ProductGrid';
import MultiRowItemSlider from '../components/app/common/multiRowItemSlider';

// Define constants here
const components = {
	grid: 'image-grid.data',
	static: 'static-banner.data',
	productSlider: 'product-slider.data',
	textData: 'text-block.data',
	itemSlider: 'item-slider.item-slider',
	recomItems: 'recom-items.recom-items',
  productGrid: 'product-grid.product-grid',
  multiRowItemSlider: 'multi-row-slider.multi-row-item-slider'
};

// Change Layout definitions here
const getContainerData = (block, onboardingCount) => {
	switch (block?.__component) {
    case components.grid: {
      let colCount = block.columnCount ? block.columnCount : 3;
      return (
        <div className={`grid grid-cols-${colCount}`} style={block?.layoutConfig} key={block?.id} >
          {block?.gridItems?.map((item) => {
            return (
              <div key={item?.id} style={{ backgroundImage: `url(${item?.image?.url})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                {item?.actionUri ? (
                  <Link href={item?.actionUri}>
                    <a>
                      <img style={{ visibility: 'hidden' }} src={item?.image?.url} alt={item?.image?.name} />
                    </a>
                  </Link>
                ) : (
                  <img src={item?.image?.url} alt={item?.image?.name} />
                )}
              </div>
            );
          })}
        </div>
      );
    }
    case components.static: {
      if(block.data_Id == 'registeredUsers'){
        return <div style={block?.layoutConfig} className="relative" key={block?.id}>
          <img src={block?.image?.url} alt={block?.image?.name} />
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <div style={{ fontSize: "40px", fontWeight: 600, color: "#FF5616", marginTop: "-24px" }}>{onboardingCount ? onboardingCount : '2000+'}</div>
            </div>
          </div>
      }
      return (
        <div style={block?.layoutConfig} key={block?.id}>
          {block.image.ext == ".json" ? (
            <Lottie options={{ loop: true, autoplay: true, path: block?.image?.url, rendererSettings:{progressiveLoad:true} }} />
          ) : block?.actionUri ? (
            <Link href={block?.actionUri}>
              <a>
                <img src={block?.image?.url} alt={block?.image?.name} />
              </a>
            </Link>
          ) : (
            <img src={block?.image?.url} alt={block?.image?.name} />
          )}
        </div>
      );
    }
    case components.productSlider: {
      return (
        <div className="py-5 mb-2" key={block?.__component?.id} style={{...block?.layoutConfig?.wrapper}}>
          <ProductCarousel products={block?.rows?.[0]?.products.sort((a, b) => b.id > a.id)} title={block?.title} seeMoreUrl={block?.showMoreUri} />
        </div>
      );
    }
    case components.itemSlider: {
      return (
        <div className="mb-2" key={block?.__component?.id} style={block?.layoutConfig?.wrapper}>
          <ItemSlider items={block.sliderItem} title={block?.title} seeMoreUrl={block?.showMoreUri} itemStyle={block?.layoutConfig?.item} />
        </div>
      );
    }
    case components.textData: {
      return (
        <div key={block?.__component?.id} style={block?.layoutConfig}>
          {block?.text}
        </div>
      );
    }
    case components.recomItems: {
      return (
        <div className="px-3 py-2" key={block?.__component?.id} style={block?.layoutConfig}>
          <ProductCarousel products={block?.data.recomms.map((r) => ({ id: r.id , ...r.values}))} title={block?.title} seeMoreUrl={block?.showMoreUri} />
        </div>
      );
    }
    case components.productGrid: {
      // console.log(block?.productGridItems);
      return (
        <div className="mb-2" key={block?.__component?.id} style={block?.layoutConfig?.wrapper}>
          <ProductGrid products={block?.productGridItems?.map(pg => pg.productId)} title={block?.title} showMoreUri={block?.showMoreUri} background={block?.background}/>
        </div>
      );
    }
    case components.multiRowItemSlider: {
      return (
        <div className="mb-2" key={block?.__component?.id} style={block?.layoutConfig?.wrapper}>
          <MultiRowItemSlider items1={block.row1} items2={block.row2} title={block?.title} seeMoreUrl={block?.showMoreUri} itemStyle={block?.layoutConfig?.item} />
        </div>
      );
    }
    default: {
      return <></>;
    }
  }
};

// Change hook implementation here
export const useLayoutBaker = (blocks, onboardingCount) => {
	const [renderedBlock, setRenderedBlock] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(async () => {
    // const block = async () => {
      setLoading(true);
      const session = await getSession();
      if (blocks) {
        setRenderedBlock(
          blocks?.map(block => {
            if(block.serviceable_cities && block.serviceable_cities.length > 0 ){
              if(block.serviceable_cities.findIndex(c => c.name == session?.user?.defaultCity) > -1){
                return getContainerData(block, onboardingCount);
              }
            }else{
              return getContainerData(block, onboardingCount);
            }
          })
        );
        setLoading(false);
      } else {
        setError(true);
      }
    // }
    // block();
	}, []);

	return { renderedBlock, loading, error };
};