import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

interface PropertyImagesType {
  images?: string[];
}

const PropertyImages = ({ images }: PropertyImagesType) => {
  const imagesLength = images?.length ?? 0;
  return (
    <Gallery>
      <section className="bg-blue-50 p-4 ">
        <div className="container mx-auto">
          {imagesLength === 1 ? (
            <Item
              original={images![0]}
              thumbnail={images![0]}
              width={1000}
              height={600}
            >
              {({ ref, open }) => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={images![0]}
                  alt=""
                  className="object-cover h-[400px] mx-auto rounded-xl"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority
                />
              )}
            </Item>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {(images || []).map((image, index) => (
                <div
                  key={index}
                  className={`${
                    imagesLength === 3 && index === 2
                      ? "col-span-2"
                      : "col-span-1"
                  }`}
                >
                  <Item
                    original={image}
                    thumbnail={image}
                    width={1000}
                    height={600}
                  >
                    {({ ref, open }) => (
                      <Image
                        ref={ref}
                        onClick={open}
                        src={image}
                        alt=""
                        className="object-cover h-[400px] w-full rounded-xl"
                        width={0}
                        height={0}
                        sizes="100vw"
                        priority
                      />
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyImages;
