import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Flex, Text, Button } from '@mantine/core';
import { FaArrowRight } from "react-icons/fa";

import { useCart } from '../../Context/CartContext';
import ProductAccordion from '../../Components/ProductAccordion/ProductAccordion';
import './ProductDescription.css';

const ProductDescription = () => {
  const { id } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_LINK}/api/product/getProductInfo/${id}`
        );
        setProductInfo(response.data);
      } catch (err) {
        console.log("Error fetching info:", err);
      }
    };
    fetchProductInfo();
  }, [id]);

  if (!productInfo) {
    return <p style={{ padding: '40px', fontSize: '13px', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Loading product...</p>;
  }

  const availableSizes = productInfo.sizes.filter((s) => s.stock > 0);

  return (
    <Flex className='product-desc-container'>
      <div className="product-desc-img-wrapper">
        <div
          className="product-desc-img"
          style={{ backgroundImage: `url(${productInfo.images?.[0]})` }}
        />
      </div>

      <Flex gap="24px" w="50%" direction="column" className="product-desc-info">
        <Text className='product-desc-name'>{productInfo.name}</Text>
        <Text className='product-desc-price'>Rs. {productInfo.price}</Text>

        {/* COLORS */}
        <Flex gap={8} direction="column">
          <Text className="product-desc-label">Color</Text>
          <Flex gap={8}>
            {productInfo.colors.map((color) => (
              <div
                key={color}
                className="product-desc-color-options active"
                style={{ backgroundColor: color }}
              />
            ))}
          </Flex>
        </Flex>

        {/* SIZES */}
        <Flex gap={8} direction="column">
          <Text className="product-desc-label">Select size</Text>
          <Flex gap={8} wrap="wrap">
            {productInfo.sizes.map(({ size, stock }) => {
              const isOut = stock === 0;
              const isSelected = selectedSize === size;
              return (
                <div
                  key={size}
                  className={`product-desc-size-options ${isSelected ? "active" : ""} ${isOut ? "out-of-stock" : ""}`}
                  onClick={() => { if (!isOut) setSelectedSize(size); }}
                  title={isOut ? "Out of stock" : ""}
                >
                  {size}
                  {isOut && <span className="strike-line" />}
                </div>
              );
            })}
          </Flex>
          {availableSizes.length === 0 && (
            <Text size="sm" c="red" style={{ fontSize: '12px', letterSpacing: '0.05em' }}>Out of stock</Text>
          )}
        </Flex>

        {/* ADD TO CART */}
        <Flex align="center" direction='column' gap={8} w="100%">
          <Button
            w="100%"
            tt="uppercase"
            className="add-to-bag-btn"
            disabled={!selectedSize}
            rightSection={<FaArrowRight size={12} />}
            onClick={() => addToCart(productInfo._id, selectedSize)}
          >
            Add to bag
          </Button>
          <Text className="delivery-note">Free delivery above ₹2000</Text>
        </Flex>

        <ProductAccordion description={productInfo.description} material={productInfo.material} />
      </Flex>
    </Flex>
  );
};

export default ProductDescription;
