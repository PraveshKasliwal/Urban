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

  // ✅ GUARD
  if (!productInfo) {
    return <p>Loading product...</p>;
  }

  // ✅ FILTER SIZES WITH STOCK > 0
  const availableSizes = productInfo.sizes.filter(
    (s) => s.stock > 0
  );

  return (
    <Flex gap={20} className='product-desc-container'>
      <Flex w={"50%"} h={"600px"} align={"center"} justify={"center"}>
        <div
          className="product-desc-img"
          style={{ backgroundImage: `url(${productInfo.images?.[0]})` }}
        />
      </Flex>

      <Flex gap={"20px"} w={"50%"} direction="column">
        <Text size='35px'>{productInfo.name}</Text>
        <Text c={"#B5A642"} size='20px'>
          Rs. {productInfo.price}
        </Text>

        {/* COLORS */}
        <Flex gap={8} direction="column">
          <Text c={"#747b6f"}>Color</Text>
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
          {/* SIZES */}
          <Flex gap={8} direction="column">
            <Text c={"#747b6f"}>Select size</Text>

            <Flex gap={8}>
              {productInfo.sizes.map(({ size, stock }) => {
                const isOut = stock === 0;
                const isSelected = selectedSize === size;

                return (
                  <div
                    key={size}
                    className={`
            product-desc-size-options
            ${isSelected ? "active" : ""}
            ${isOut ? "out-of-stock" : ""}
          `}
                    onClick={() => {
                      if (!isOut) setSelectedSize(size);
                    }}
                    title={isOut ? "Out of stock" : ""}
                  >
                    {size}
                    {isOut && <span className="strike-line" />}
                  </div>
                );
              })}
            </Flex>
          </Flex>

          {availableSizes.length === 0 && (
            <Text size="sm" c="red">
              Out of stock
            </Text>
          )}
        </Flex>

        {/* ADD TO CART */}
        <Flex align={"center"} direction='column' gap={5} w={"100%"}>
          <Button
            w={"100%"}
            tt={"uppercase"}
            size='20px'
            bg={"#c36522"}
            h={60}
            c={"#fff"}
            disabled={!selectedSize}
            rightSection={<FaArrowRight size={14} />}
            onClick={() => addToCart(productInfo._id, selectedSize)}
          >
            Add to bag
          </Button>

          <Text c={"#747b6f"} size='10px'>
            Free delivery above 2000
          </Text>
        </Flex>

        <ProductAccordion description={productInfo.description} material={productInfo.material} />
      </Flex>
    </Flex>
  );
};

export default ProductDescription;