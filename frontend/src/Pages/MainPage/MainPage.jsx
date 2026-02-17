import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, Text } from '@mantine/core';

import Navbar from '../../Components/Navbar/Navbar';
import CardsCarousel from '../../Components/Carousel/CardsCarousel';
import ProductCarousel from '../../Components/Carousel/ProductCarousel';

import './MainPage.css';

const collections = [
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
  {
    title: "Outerwear",
    image: "/images/MainPage-img.jpg",
  },
];


const productData = [
  {
    name: "SweatShirt",
    price: "$120",
    image: "/images/product1.png",
  },
  {
    name: "Pants",
    price: "$120",
    image: "/images/product2.png",
  },
  {
    name: "Shirt",
    price: "$120",
    image: "/images/product3.png",
  },
  {
    name: "SweatShirt",
    price: "$120",
    image: "/images/product1.png",
  },
  {
    name: "Pants",
    price: "$120",
    image: "/images/product2.png",
  },
  {
    name: "Shirt",
    price: "$120",
    image: "/images/product3.png",
  },
  {
    name: "SweatShirt",
    price: "$120",
    image: "/images/product1.png",
  },
  {
    name: "Pants",
    price: "$120",
    image: "/images/product2.png",
  },
  {
    name: "Shirt",
    price: "$120",
    image: "/images/product3.png",
  },
  {
    name: "SweatShirt",
    price: "$120",
    image: "/images/product1.png",
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <Flex className="main-page">
      <Flex className="hero-section">
        <div className="mainPage-img-container"></div>

        <Flex className="mainPage-img-overlay">
          <Text className="hero-title">
            Elevate your everyday
          </Text>

          <Text className="hero-subtitle">
            Sustainable fabric for modern minimalist
          </Text>

          <Flex className="hero-buttons">
            <Button className="btn-women" onClick={() => navigate("/product/women")}>Shop for women</Button>
            <Button className="btn-men" onClick={() => navigate("/product/women")}>Shop for men</Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex className="collections-section">
        <Flex className="section-block">
          <Text className="section-title">Our Collection</Text>
          <CardsCarousel data={collections} />
        </Flex>

        <Flex className="section-block">
          <Text className="section-title">Trending</Text>
          <ProductCarousel data={productData} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MainPage;