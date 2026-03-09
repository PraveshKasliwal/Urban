import { useRef, useState, useEffect } from 'react';
import { Paper, Title, Image, Flex } from '@mantine/core';
import './ProductMedia.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ProductMedia = ({ images, setImages }) => {
    const mainInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const [mainImage, setMainImage] = useState(null);
    const [gallery, setGallery] = useState([]);

    const [mainFile, setMainFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    useEffect(() => {
        const allFiles = [
            ...(mainFile ? [mainFile] : []),
            ...galleryFiles,
        ];
        setImages(allFiles);
    }, [mainFile, galleryFiles, setImages]);

    const handleMainImage = (file) => {
        if (!file) return;
        
        if (file.size > MAX_FILE_SIZE) {
            alert("Image must be less than 5MB");
            return;
        }

        setMainFile(file);
        setMainImage(URL.createObjectURL(file));
    };

    const handleGalleryImage = (file) => {
        if (!file || gallery.length >= 4) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("Image must be less than 5MB");
            return;
        }

        setGalleryFiles((prev) => [...prev, file]);
        setGallery((prev) => [...prev, URL.createObjectURL(file)]);
    };

    const removeGalleryImage = (index) => {
        setGallery((prev) => prev.filter((_, i) => i !== index));
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Paper className="AddProductImage-card">
            <Title order={3} className="AddProductImage-card-title">
                Product Media
            </Title>

            <div
                className="AddProductImage-upload-box"
                onClick={() => mainInputRef.current.click()}
            >
                {mainImage ? (
                    <div className="AddProductImage-image-wrapper" style={{
                        backgroundImage: `url(${mainImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }}>
                        {/* <Image src={mainImage} fit="cover" /> */}

                        <button
                            className="AddProductImage-remove-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setMainImage(null);
                                setMainFile(null);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <Flex direction={"column"} justify={"center"} align={"center"}>
                        <p className="AddProductImage-upload-title">Upload main image</p>
                        <p className="AddProductImage-upload-sub">JPG, PNG, WEBP</p>
                    </Flex>
                )}
            </div>

            <input
                ref={mainInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleMainImage(e.target.files[0])}
            />
        </Paper>
    );
};

export default ProductMedia;