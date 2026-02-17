import { Carousel } from '@mantine/carousel';

import classes from './CardsCarousel.module.css';

import CollectionCard from '../CollectionCard/CollectionCard';

const CardsCarousel = ({ data }) => {
  return (
    <Carousel
      slideSize="20%"
      height={300}
      slideGap="3%"
      controlsOffset="xs"
      controlSize={29}
      withControls
      withIndicators={false}
      classNames={classes}
    >
      {data.map((item, index) => (
        <Carousel.Slide key={index}>
          <CollectionCard
            title={item.title}
            image={item.image}
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default CardsCarousel