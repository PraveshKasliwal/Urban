import { Carousel } from "@mantine/carousel";
import ProductCard from "../ProductCard/ProductCard";
import classes from "./ProductCarousel.module.css";

const ProductCarousel = ({ data }) => {
  return (
    <Carousel
      height={360}
      slideGap="md"
      controlsOffset="xs"
      controlSize={28}
      withControls
      withIndicators={false}
      align="start"
      slideSize="20%" // desktop default
      classNames={classes}
    >
      {data.map((item) => (
        <Carousel.Slide key={item._id}>
          <ProductCard
            name={item.name}
            price={item.price}
            image={item.image}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;