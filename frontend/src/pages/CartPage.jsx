import { Button, Card, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, checkout } = useCart();

  const safeItems = Array.isArray(items) ? items : [];

  const subtotal = safeItems.reduce((total, item) => {
    const price = item.product?.price ?? 0;
    const qty = item.quantity ?? 0;
    return total + price * qty;
  }, 0);

  const handleQuantityChange = (item, value) => {
    const qty = parseInt(value, 10);
    if (Number.isNaN(qty) || qty <= 0) return;
    updateQuantity(item.id, qty).catch((e) =>
      alert(e.message || "Failed to update quantity")
    );
  };

  const handleRemove = (item) => {
    removeItem(item.id).catch((e) =>
      alert(e.message || "Failed to remove item")
    );
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      alert("Order placed successfully!");
    } catch (e) {
      alert(e.message || "Checkout failed");
    }
  };

  if (safeItems.length === 0) {
    return <p className="text-muted">Your cart is empty.</p>;
  }

  return (
    <div>
      <h2 className="page-title">Your Cart</h2>

      <div className="d-flex flex-column gap-3">
        {safeItems.map((item) => {
          const product = item.product || {};
          const price = product.price ?? 0;

          return (
            <Card key={item.id} className="cart-card">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">
                    {product.name || "Product"}
                  </div>
                  <div className="text-muted small">
                    {product.brand && `${product.brand} · `}
                    {product.category}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <div className="small text-muted">Price</div>
                    <div>₹{price}</div>
                  </div>

                  <div>
                    <div className="small text-muted">Qty</div>
                    <Form.Control
                      type="number"
                      min="1"
                      style={{ width: "70px" }}
                      value={item.quantity ?? 1}
                      onChange={(e) => handleQuantityChange(item, e.target.value)}
                    />
                  </div>

                  <div className="text-end">
                    <div className="small text-muted">Total</div>
                    <div>₹{price * (item.quantity ?? 0)}</div>
                  </div>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4 cart-summary-card">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <div className="small text-muted">Subtotal</div>
            <div className="cart-subtotal">₹{subtotal}</div>
          </div>
          <Button variant="warning" onClick={handleCheckout}>
            Proceed to payment
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
