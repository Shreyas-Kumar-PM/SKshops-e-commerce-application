import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://localhost:3000/api";

export default function ProductListPage() {
  const { category } = useParams();              
  const [searchParams] = useSearchParams();      
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const url = `${API_BASE}/products`;
    console.log("Fetching products from:", url);

    fetch(url)
      .then((res) => {
        console.log("Products status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Products payload:", data);
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category) {
      const cat = category.toLowerCase(); 
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === cat
      );
    }

    const brand = searchParams.get("brand") || "";
    if (brand) {
      list = list.filter((p) => (p.brand || "") === brand);
    }

    const sort = searchParams.get("sort") || "";
    if (sort === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price_desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [products, category, searchParams]);

  const title = category ? category.toUpperCase() : "ALL PRODUCTS";

  return (
    <div>
      <h2 className="page-title">{title}</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {}
      <Row xs={1} sm={2} md={2} lg={2} xl={2} className="g-4">
        {filteredProducts.map((p) => (
          <Col key={p.id}>
            <ProductCard product={p} />
          </Col>
        ))}
        {!loading && !error && filteredProducts.length === 0 && (
          <Col>
            <p className="text-muted small">
              No products match the selected filters.
            </p>
          </Col>
        )}
      </Row>
    </div>
  );
}
