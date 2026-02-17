import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard2.css";
import { Text, Flex } from "@mantine/core";

const ProductCard2 = ({ id, name, price, image, colorsData }) => {
    const navigate = useNavigate();
    return (
        <div className="product2-card" onClick={() => navigate(`/product/${id}`)}>
            <div className="product2-card-img-container">
                <div onClick={() => navigate(`/product/${id}`)}
                    className="product2-card-bg"
                    style={{ backgroundImage: `url(${image})` }}
                />
            </div>

            <Flex className="product2-card-info-wrapper">
                <Flex className="product2-card-info">
                    <Text className="product2-card-name">{name}</Text>
                    <Text className="product2-card-price">₹{price}</Text>
                </Flex>
                <Flex gap={5}>
                    {colorsData.map((color) => (
                        <div
                            key={color}
                            className={`color-options`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </Flex>
            </Flex>
        </div>
    );
};

export default ProductCard2;