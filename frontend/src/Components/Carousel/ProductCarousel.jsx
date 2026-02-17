import { Carousel } from '@mantine/carousel';

import classes from './ProductCarousel.module.css';

import ProductCard from '../ProductCard/ProductCard';

const ProductCarousel = ({ data }) => {
  return (
    <Carousel
      slideSize="20%"
      height={"360"}
      slideGap="3%"
      controlsOffset="xs"
      controlSize={29}
      withControls
      withIndicators={false}
      classNames={classes}
    >
      {data.map((item, index) => (
        <Carousel.Slide key={index}>
          <ProductCard
            name={item.name}
            price={item.price}
            image={item.image}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default ProductCarousel