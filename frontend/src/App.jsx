import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; 
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-root">
          <Header />
          <Container fluid className="mt-3 main-container">
            <Row>
              <Col md={3} lg={2} className="d-none d-md-block">
                <Sidebar />
              </Col>
              <Col xs={12} md={9} lg={10}>
                <Routes>
                  <Route path="/" element={<ProductListPage />} />
                  <Route path="/category/:category" element={<ProductListPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Col>
            </Row>
          </Container>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
