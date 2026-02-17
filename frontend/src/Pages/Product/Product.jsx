import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Flex } from "@mantine/core";
import "./Product.css";

import FilterPanel from "../../Components/FilterPanel/FilterPanel";
import ProductCard2 from "../../Components/ProductCard/ProductCard2";

const Product = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    price: [1, 10000],
    sizes: [],
    colors: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_LINK}/api/product/getProducts/${category}`,
          {
            params: {
              minPrice: filters.price[0],
              maxPrice: filters.price[1],
              sizes: filters.sizes.join(","),
              colors: filters.colors.join(","),
            },
          }
        );

        setProducts(res.data.products);
        setAvailableColors(res.data.availableColors);
      } catch (err) {
        console.error("FETCH PRODUCTS ERROR :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, filters]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading products...</p>;
  }

  return (
    <Flex>
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        availableColors={availableColors}
      />

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard2
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.images?.[0]}
            colorsData={product.colors}
          />
        ))}
      </div>
    </Flex>
  );
};

export default Product;