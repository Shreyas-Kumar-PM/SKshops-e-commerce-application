import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Card as={Link} to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <Card.Img variant="top" src={product.image_url} alt={product.name} />
      </div>
      <Card.Body>
        <Card.Title className="product-title">{product.name}</Card.Title>
        <div className="d-flex justify-content-between align-items-center">
          <span className="product-price">₹{product.price}</span>
          {product.average_rating && (
            <Badge bg="warning" text="dark">
              ★ {product.average_rating}
            </Badge>
          )}
        </div>
        <div className="text-muted small mt-1">{product.brand}</div>
      </Card.Body>
    </Card>
  );
}
