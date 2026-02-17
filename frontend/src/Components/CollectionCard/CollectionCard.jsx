import React from "react";
import "./CollectionCard.css";

const CollectionCard = ({ title, image }) => {
  return (
    <div className="collection-card">
      <div
        className="collection-card-bg"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="collection-card-overlay" />

      <div className="collection-card-content">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default CollectionCard;
