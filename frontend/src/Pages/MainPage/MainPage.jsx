import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Button, Text, Loader } from '@mantine/core';
import axios from 'axios';

import ProductCarousel from '../../Components/Carousel/ProductCarousel';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [latestProducts, setLatestProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, trendingRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/product/latest`),
          axios.get(`${import.meta.env.VITE_APP_BACKEND_LINK}/api/product/trending`)
        ]);
        setLatestProducts(Array.isArray(latestRes.data) ? latestRes.data : []);
        setTrendingProducts(Array.isArray(trendingRes.data) ? trendingRes.data : []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatData = (data) => (data || []).map(prod => ({
    name: prod.name,
    price: `${prod.price}`,
    image: prod.images?.[0] || "/images/placeholder.jpg"
  }));

  return (
    <Flex className="main-page">
      <Flex className="hero-section">
        <div className="mainPage-img-container"></div>

        <Flex className="mainPage-img-overlay">
          <Text className="hero-title">
            Elevate<br />your<br />everyday
          </Text>
          <span className="hero-line" />
          <Text className="hero-subtitle">
            Sustainable fabric · Modern minimalist
          </Text>

          <Flex className="hero-buttons">
            <Button className="btn-women" onClick={() => navigate("/product/women")}>Shop Women</Button>
            <Button className="btn-men" onClick={() => navigate("/product/men")}>Shop Men</Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex className="collections-section">
        <Flex className="section-block">
          <div className="section-header">
            <Text className="section-title">Latest Additions</Text>
            <span className="section-count">{latestProducts.length} items</span>
          </div>
          {loading ? (
            <Flex justify="center" p="40px"><Loader size="sm" color="#c36522" /></Flex>
          ) : (
            <ProductCarousel data={formatData(latestProducts)} />
          )}
        </Flex>

        <Flex className="section-block">
          <div className="section-header">
            <Text className="section-title">Trending</Text>
            <span className="section-count">{trendingProducts.length} items</span>
          </div>
          <ProductCarousel data={formatData(trendingProducts)} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MainPage;
