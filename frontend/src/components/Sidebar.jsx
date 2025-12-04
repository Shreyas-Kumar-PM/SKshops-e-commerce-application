import { Card, Form } from "react-bootstrap";
import { useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BRANDS = ["Nike", "Adidas", "Puma", "Casio", "Rolex", "Apple"];

export default function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const location = useLocation();

  const selectedBrand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const showProfileCard = !!user && location.pathname !== "/profile";

  const avatarInitial = (() => {
    if (!user) return "?";
    if (user.name && typeof user.name === "string" && user.name.length > 0) {
      return user.name[0].toUpperCase();
    }
    if (user.email && typeof user.email === "string" && user.email.length > 0) {
      return user.email[0].toUpperCase();
    }
    return "?";
  })();

  return (
    <div className="sidebar">
      {showProfileCard && (
        <Card className="mb-3 sidebar-card">
          <Card.Body>
            <Card.Title className="small-heading">Your Profile</Card.Title>
            <div className="profile-chip">
              <div className="avatar-circle">{avatarInitial}</div>
              <div>
                <div className="text-muted small">Signed in as</div>
                <div className="fw-semibold">{user.name || "User"}</div>
                <div className="text-muted small">{user.email}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card className="sidebar-card">
        <Card.Body>
          <Card.Title className="small-heading">Filter</Card.Title>

          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Select
              value={selectedBrand}
              onChange={(e) => updateParam("brand", e.target.value)}
            >
              <option value="">All brands</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Sort by price</Form.Label>
            <Form.Select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Low to High</option>
              <option value="price_desc">High to Low</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
}
