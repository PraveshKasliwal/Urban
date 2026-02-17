import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProduct.css";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    category: "Men",
    material: "",
    description: "",
    price: 0,
    colors: [],
    images: [],
  });

  const [sizes, setSizes] = useState(
    AVAILABLE_SIZES.map((s) => ({ size: s, stock: 0 }))
  );

  // 🔹 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data;
        console.log(`data: ${JSON.stringify(data)}`);

        setProduct({
          name: data.name,
          category: data.category,
          material: data.material,
          description: data.description,
          price: data.price,
          colors: data.colors || [],
          images: data.images || [],
        });

        setIsActive(data.isActive);

        setSizes(
          AVAILABLE_SIZES.map((s) => {
            const found = data.sizes.find((x) => x.size === s);
            return {
              size: s,
              stock: found ? found.stock : 0,
            };
          })
        );
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const updateStock = (size, value) => {
    setSizes((prev) =>
      prev.map((s) =>
        s.size === size ? { ...s, stock: Math.max(0, Number(value)) } : s
      )
    );
  };

  // 🔹 SAVE CHANGES
  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/product/${id}`,
        {
          ...product,
          sizes,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Failed to update product");
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading product...</p>;

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <h1>{product.name}</h1>

        <div className="header-actions">
          <button className="btn-outline" onClick={() => navigate(-1)}>
            Discard
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* STATUS */}
      <div className="status-card">
        <div>
          <h3>Active Status</h3>
          <p>This product is visible to customers</p>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive((p) => !p)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="edit-grid">
        {/* LEFT */}
        <div className="left-column">
          <section className="card">
            <h2>Basic Information</h2>

            <div className="field">
              <label>Product Name</label>
              <input
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                <option>Men</option>
                <option>Women</option>
              </select>
            </div>

            <div className="field">
              <label>Description</label>
              <input
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Material</label>
              <input
                value={product.material}
                onChange={(e) =>
                  setProduct({ ...product, material: e.target.value })
                }
              />
            </div>
          </section>

          {/* INVENTORY */}
          <section className="card">
            <h2>Inventory</h2>

            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Stock</th>
                  <th>Update</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((s) => (
                  <tr key={s.size}>
                    <td>{s.size}</td>
                    <td>{s.stock}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={s.stock}
                        onChange={(e) =>
                          updateStock(s.size, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {s.stock === 0 ? (
                        <span className="status out-stock">Out</span>
                      ) : s.stock <= 5 ? (
                        <span className="status low-stock">Low</span>
                      ) : (
                        <span className="status in-stock">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* RIGHT */}
        <div className="right-column">
          <section className="card">
            <h2>Pricing</h2>

            <div className="field">
              <label>Price (₹)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;