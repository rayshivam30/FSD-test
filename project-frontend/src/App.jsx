import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./pages/ProductForm";
import LandingPage from "./pages/LandingPage";
import "./index.css";

const HomeWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <ProductList /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/products/new" element={
              <ProtectedRoute><ProductForm mode="create" /></ProtectedRoute>
            } />
            <Route path="/products/:id/edit" element={
              <ProtectedRoute><ProductForm mode="edit" /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
