import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Spinner, Alert, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:3000/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth(); 

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(() => setError("Failed to load product"));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert("Added to cart");
    } catch (e) {
      alert(e.message || "Could not add to cart");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Login to leave a review");
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ review: { rating, comment } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0] || "Failed");
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), data],
      }));
      setComment("");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product && !error) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Row className="align-items-start">
        <Col md={5}>
          <div className="product-detail-image-wrapper">
            <img src={product.image_url} alt={product.name} />
          </div>
        </Col>
        <Col md={7}>
          <h2 className="page-title">{product.name}</h2>
          <div className="text-muted mb-1">{product.brand}</div>
          <h3 className="product-price mb-3">₹{product.price}</h3>
          {product.average_rating && (
            <div className="mb-2">
              <strong>Rating:</strong> ★ {product.average_rating}
            </div>
          )}
          <p className="mb-3">{product.description}</p>
          <Button variant="warning" className="me-2" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>

      {}
      <Row className="mt-5 review-section">
        <Col md={6}>
          <h4 className="section-title mb-3">Reviews</h4>
          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <Card key={r.id} className="mb-3 review-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="review-author">
                      {r.user?.name || "User"}
                    </span>
                    <span className="review-rating">★ {r.rating}</span>
                  </div>
                  {r.comment && (
                    <p className="review-comment mb-0">{r.comment}</p>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-muted small">
              No reviews yet. Be the first to review this product.
            </div>
          )}
        </Col>

        <Col md={6}>
          <h4 className="section-title mb-3">Write a review</h4>
          <Form onSubmit={handleReviewSubmit} className="review-form">
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
              />
            </Form.Group>
            <Button type="submit" disabled={submittingReview}>
              {submittingReview ? "Submitting..." : "Submit review"}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
