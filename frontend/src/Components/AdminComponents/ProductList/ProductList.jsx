import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Group,
  Text,
  Image,
  ActionIcon,
  NumberInput,
  Loader,
} from "@mantine/core";
import { Pagination } from "@mantine/core";
import { MdDelete, MdEdit } from "react-icons/md";

import "./ProductList.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber = 1) => {
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
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);


  const handleEdit = (productId) => {
    const confirm = window.confirm("Edit this product?");
    if (!confirm) return;
    navigate(`/admin/edit-product/${productId}`)
    // navigate later
    // console.log("EDIT PRODUCT:", productId);
  };

  const handleDelete = async (productId) => {
    const confirm = window.confirm(
      "Are you sure? This will permanently delete the product."
    );
    if (!confirm) return;

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
  };

  if (loading) {
    return (
      <div className="admin-loader">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th align="center">Total Stock</Table.Th>
            <Table.Th align="right">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {products.map((product) => (
            <Table.Tr key={product._id}>
              <Table.Td>
                <Group gap={12}>
                  <img
                    src={product.images?.[0]}
                    width={50}
                    height={50}
                    loading="lazy"
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
                    onClick={() => handleEdit(product._id)}
                  >
                    <MdEdit size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(product._id)}
                  >
                    <MdDelete size={18} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
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
