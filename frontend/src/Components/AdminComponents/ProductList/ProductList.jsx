import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Loader,
  Pagination,
} from "@mantine/core";
import { MdDelete, MdEdit } from "react-icons/md";

import "./ProductList.css";

/* -------------------- Product Row (Memoized) -------------------- */
const ProductRow = React.memo(({ product, onEdit, onDelete }) => {
  return (
    <Table.Tr className="admin-product-row">
      <Table.Td>
        <Group gap={12} wrap="nowrap">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="admin-product-img"
          />
          <Text fw={500}>{product.name}</Text>
        </Group>
      </Table.Td>

      <Table.Td align="center">
        <Text
          fw={600}
          className={
            product.totalStock === 0
              ? "stock-zero"
              : product.totalStock < 5
              ? "stock-low"
              : ""
          }
        >
          {product.totalStock}
        </Text>
      </Table.Td>

      <Table.Td align="right">
        <Group justify="flex-end" gap={6}>
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => onEdit(product._id)}
          >
            <MdEdit size={18} />
          </ActionIcon>

          <ActionIcon
            variant="light"
            color="red"
            onClick={() => onDelete(product._id)}
          >
            <MdDelete size={18} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
});

/* -------------------- Main Component -------------------- */
const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------- Fetch Products -------------------- */
  const fetchProducts = useCallback(async (pageNumber) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/products`,
        {
          params: { page: pageNumber },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("FETCH ADMIN PRODUCTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  /* -------------------- Handlers -------------------- */
  const handleEdit = useCallback(
    (productId) => {
      if (!window.confirm("Edit this product?")) return;
      navigate(`/admin/edit-product/${productId}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(async (productId) => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete the product."
      )
    )
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
      alert("Failed to delete product");
    }
  }, []);

  /* -------------------- Loader -------------------- */
  if (loading) {
    return (
      <div className="admin-loader">
        <Loader size="lg" />
      </div>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="admin-table-wrapper">
      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th align="center">Total Stock</Table.Th>
            <Table.Th align="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="center" mt="xl">
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          color="orange"
        />
      </Group>
    </div>
  );
};

export default ProductList;