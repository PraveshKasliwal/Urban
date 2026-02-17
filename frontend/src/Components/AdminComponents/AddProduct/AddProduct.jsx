import { useState } from "react";
import {
    Text,
    TextInput,
    Select,
    Button,
    Paper,
    Grid,
    Title,
    NumberInput,
    Textarea,
    Group,
    ColorInput,
} from "@mantine/core";
import axios from "axios";
import ProductMedia from "../ProductMedia";
import "./AddProduct.css";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
    const [mediaKey, setMediaKey] = useState(0);
    const [product, setProduct] = useState({
        name: "",
        price: 0,
        category: null,
        description: "",
        material: "",
        colors: [],
    });

    const [images, setImages] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;

        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addColor = (color) => {
        if (!color || product.colors.includes(color)) return;
        setProduct((prev) => ({
            ...prev,
            colors: [...prev.colors, color],
        }));
        setSelectedColor("");
    };

    const removeColor = (color) => {
        setProduct((prev) => ({
            ...prev,
            colors: prev.colors.filter((c) => c !== color),
        }));
    };


    const [sizes, setSizes] = useState(
        AVAILABLE_SIZES.map((size) => ({
            size,
            stock: 0,
        }))
    );

    const finalSizes = sizes.map((s) => ({
        size: s.size,
        stock: s.stock,
    }));

    const updateStock = (size, value) => {
        setSizes((prev) =>
            prev.map((s) =>
                s.size === size
                    ? { ...s, stock: Math.max(0, Number(value)) }
                    : s
            )
        );
    };



    const validateProduct = () => {
        if (!product.name.trim()) return "Product name is required";
        if (!product.price || product.price <= 0) return "Price must be greater than 0";
        if (!product.category) return "Please select a category";
        if (!product.material.trim()) return "Material is required";
        if (!product.description.trim()) return "Description is required";
        if (product.colors.length === 0) return "Please add at least one color";
        if (images.length === 0) return "Please upload at least one image";

        const hasStock = sizes.some((s) => s.stock > 0);
        if (!hasStock) return "At least one size must have stock";

        return null;
    };


    const handleSubmit = async () => {
        try {
            const error = validateProduct();
            if (error) {
                alert(error);
                return;
            }

            const finalSizes = sizes.map((s) => ({
                size: s.size,
                stock: s.stock,
            }));


            if (finalSizes.length === 0) {
                alert("Please select at least one size with stock");
                return;
            }

            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("category", product.category);
            formData.append("material", product.material);
            formData.append("description", product.description);
            formData.append("sizes", JSON.stringify(finalSizes));
            formData.append("colors", JSON.stringify(product.colors));

            images.forEach((img) => {
                formData.append("images", img);
            });


            await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_LINK}/api/admin/addProduct`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Product created successfully");

            setProduct({
                name: "",
                price: 0,
                category: null,
                material: "",
                description: "",
                colors: [],
            });

            setSizes(
                AVAILABLE_SIZES.map((size) => ({
                    size,
                    stock: 0,
                }))
            );

            setImages([]);
            setMediaKey((prev) => prev + 1);
        } catch (err) {
            console.error(err);
            alert("Error creating product");
        }
    };

    return (
        <div className="addProduct-page">
            <Title>Add New Product</Title>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <ProductMedia key={mediaKey} images={images} setImages={setImages} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper className="addProduct-card">
                        <div className="addProduct-section">
                            <h3 className="addProduct-section-title">Size & Stock Management</h3>

                            <div className="size-grid">
                                {sizes.map((item) => (
                                    <div key={item.size} className="size-card active">
                                        <div className="size-card-header">
                                            <span className="size-label">Size {item.size}</span>
                                        </div>

                                        <div className="stock-field">
                                            <label>STOCK</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={item.stock}
                                                onChange={(e) =>
                                                    updateStock(item.size, e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="addProduct-section">
                            <h3 className="addProduct-section-title">Color Options</h3>
                            <Group mt="sm">
                                {product.colors.map((color) => (
                                    <div key={color} className="addProduct-color-wrapper">
                                        <div
                                            className="addProduct-color-swatch"
                                            style={{ backgroundColor: color }}
                                        />
                                        <button
                                            className="addProduct-remove-color"
                                            onClick={() => removeColor(color)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </Group>
                            <ColorInput
                                placeholder="Pick a color"
                                value={selectedColor}
                                onChange={setSelectedColor}
                                onBlur={() => addColor(selectedColor)}
                                format="hex"
                                mt="sm"
                            />
                        </div>
                    </Paper>
                    <Paper className="addProduct-card" mt={10}>
                        <Grid>
                            <Grid.Col span={12}>
                                <TextInput
                                    label="Product Name"
                                    name="name"
                                    placeholder="Minimalist Oversized Hoodie"
                                    value={product.name}
                                    onChange={handleChange}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <NumberInput
                                    label="Price"
                                    min={0}
                                    value={product.price}
                                    onChange={(value) =>
                                        setProduct((prev) => ({ ...prev, price: value }))
                                    }
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Select
                                    label="Category"
                                    data={[
                                        { value: "Men", label: "Men" },
                                        { value: "Women", label: "Women" },
                                    ]}
                                    value={product.category}
                                    onChange={(value) =>
                                        setProduct((prev) => ({
                                            ...prev,
                                            category: value || null,
                                        }))
                                    }
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea
                                    label="Description"
                                    name="description"
                                    minRows={3}
                                    value={product.description}
                                    onChange={handleChange}
                                    styles={{
                                        input: { height: "180px", }
                                    }}
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea
                                    label="Material"
                                    name="material"
                                    minRows={3}
                                    value={product.material}
                                    onChange={handleChange}
                                    styles={{
                                        input: { height: "180px", }
                                    }}
                                />
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Grid.Col>
            </Grid>
            <Group mt={10} justify="flex-end">
                <Button color="orange" onClick={handleSubmit}>
                    Add Product
                </Button>
            </Group>
        </div>
    );
};

export default AddProduct;