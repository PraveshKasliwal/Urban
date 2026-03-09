import "./StyleStudio.css";
import { useState } from "react";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay } from "@mantine/core";
import ProductCard2 from "../../Components/ProductCard/ProductCard2";


import { MdAutoAwesome, MdShare } from "react-icons/md";

const StyleStudio = () => {
    const [imageLoading, setImageLoading] = useState(false);

    const [prompt, setPrompt] = useState("");

    const [products, setProducts] = useState([]);

    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        try {
            setLoading(true);
            setImageLoading(true);
            setProducts([]);
            setGeneratedImage(null);

            // 🔹 1. Search products
            const resp = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_LINK}/api/style/search`,
                { prompt }
            );

            setProducts(resp.data);

            // 🔹 2. Generate image (when you enable it)
            const imgRes = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_LINK}/api/style/generate`,
                { prompt }
            );
            setGeneratedImage(imgRes.data.image);

        } catch (err) {
            alert("Failed to generate style");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="style-studio-page">
            <main className="studio-container">

                <div className="studio-grid">

                    {/* LEFT PANEL */}
                    <div className="studio-left">
                        <span className="studio-badge">AI Fashion Assistant</span>

                        <h1 className="studio-title">Style Studio</h1>

                        <p className="studio-subtitle">
                            Harness artificial intelligence to curate your perfect wardrobe.
                        </p>

                        <label className="prompt-label">Describe your vision</label>
                        <textarea
                            className="prompt-input"
                            placeholder="e.g. beige oversized jacket with minimal sneakers..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <button className="generate-btn" onClick={handleGenerate}>
                            <MdAutoAwesome size={20} />
                            Generate Style
                        </button>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="studio-right">
                        <div
                            className={
                                generatedImage
                                    ? "generated-image-card"
                                    : "not-generated-image-card"
                            }
                        >
                            {/* LOADING OVERLAY */}
                            <LoadingOverlay
                                visible={imageLoading}
                                zIndex={1000}
                                overlayProps={{ radius: "md", blur: 2 }}
                            />

                            {/* EMPTY STATE */}
                            {!generatedImage && !imageLoading && (
                                <div className="empty-state">
                                    <h3 className="empty-title">Awaiting Your Inspiration</h3>
                                    <p className="empty-subtitle">
                                        Enter a prompt on the left to begin your AI-powered fashion journey.
                                        <br />
                                        Your curated wardrobe will materialize here.
                                    </p>
                                </div>
                            )}

                            {/* GENERATED IMAGE */}
                            {generatedImage && (
                                <img
                                    src={generatedImage}
                                    alt="Generated Style"
                                    className="generated-image"
                                    onLoad={() => setImageLoading(false)}
                                />
                            )}
                        </div>


                        {/* SHOP THE LOOK */}
                        {
                            products.length > 0 && (
                                <div className="shop-header">
                                    <h4>Shop the Look</h4>
                                    <span className="view-all">View all →</span>
                                </div>
                            )
                        }
                        {!imageLoading && products.length > 0 && (
                            <div className="style-studio-product-grid">
                                {products.map((p) => (
                                    <ProductCard2
                                        key={p._id}
                                        id={p._id}
                                        name={p.name}
                                        price={p.price}
                                        image={p.images?.[0]}
                                        colorsData={p.colors}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StyleStudio;