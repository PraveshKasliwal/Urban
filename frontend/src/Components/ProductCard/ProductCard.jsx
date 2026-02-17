import React from "react";
import "./ProductCard.css";
import { Text, Flex } from "@mantine/core";

const ProductCard = ({ name, price, image }) => {
    return (
        <div className="product-card">
            <div className="product-card-img-container">
                <div
                    className="product-card-bg"
                    style={{ backgroundImage: `url(${image})` }}
                />
            </div>

            <Flex className="product-card-info">
                <Text className="product-card-name">{name}</Text>
                <Text className="product-card-price">{price}</Text>
            </Flex>
        </div>
    );
};

export default ProductCard;