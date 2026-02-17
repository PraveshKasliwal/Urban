import React, { useState } from 'react';
import { Text, RangeSlider, Grid, Checkbox, Button, Flex } from '@mantine/core';
import './FilterPanel.css';

const sizes = ["S", "M", "L", "XL", "XXL"];
const colorsData = ["red", "blue", "black", "green", "yellow"];

const FilterPanel = ({ onApplyFilters, availableColors }) => {
    const [priceRange, setPriceRange] = useState(() => {
        const saved = localStorage.getItem("priceRange");
        return saved ? JSON.parse(saved) : [1, 10000];
    });

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const handleApplyFilters = () => {
        const filters = {
            price: priceRange,
            sizes: selectedSizes,
            colors: selectedColors,
        };

        onApplyFilters(filters);
    };


    const handleSizeChange = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size]
        );
    };

    const handleColorSelect = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    return (
        <div className="filter-panel">
            <Text className="filter-title">Filters</Text>

            <div className="filter-section">
                <Text className="filter-label">Price</Text>
                <Text className="price-value">
                    ₹{priceRange[0]} – ₹{priceRange[1]}
                </Text>

                <RangeSlider
                    min={1}
                    max={10000}
                    value={priceRange}
                    onChange={setPriceRange}
                    minRange={10}
                    label={null}
                    color="#c36522"
                />
            </div>

            <div className="filter-section">
                <Text className="filter-label">Size</Text>
                <Grid>
                    {sizes.map((size) => (
                        <Grid.Col key={size} span={6}>
                            <Checkbox
                                label={size}
                                checked={selectedSizes.includes(size)}
                                onChange={() => handleSizeChange(size)}
                                color='#c36522'
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </div>

            <div className="filter-section">
                <Text className="filter-label">Colors</Text>
                <Flex className='color-container' gap={10}>
                    {availableColors.map((color) => (
                        <div
                            key={color}
                            className={`color-dot ${selectedColors.includes(color) ? "active" : ""
                                }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                        />
                    ))}
                </Flex>
            </div>

            <Button className="apply-btn" onClick={handleApplyFilters}>
                Apply
            </Button>
        </div>
    );
};

export default FilterPanel;