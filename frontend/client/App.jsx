import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ArtisanDashboard from "./pages/ArtisanDashboard";
 import AddProduct from "./pages/AddProduct";
//  import ManageOrders from "./pages/ManageOrders";
//  import Cart from "./pages/Cart";
// import OrderHistory from "./pages/OrderHistory";
 import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ArtisanProducts from "./pages/ArtisanProduct";

import CreateStoryPage from "./components/CreateStoryModal";
import UnderProduction from "./pages/UnderProduction";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import ExploreMarketplace from "./pages/ExploreMarketplace";
import ProductPage from "./pages/ProductPage";
const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/marketplace" element={<ExploreMarketplace />} />

               <Route
                path="/artisan/dashboard"
                element={
                  <ProtectedRoute role="artisan">
                    <ArtisanDashboard />
                  </ProtectedRoute>
                }
              />
             <Route
                path="/artisan/add-product"
                element={
                  <ProtectedRoute role="artisan">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artisan/products"
                element={
                  <ProtectedRoute role="artisan" >
                    <ArtisanProducts />
                  </ProtectedRoute>
                }
              />
                <Route
                path="/artisan/story/:id"
                element={
                  <ProtectedRoute role="artisan">
                    <CreateStoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artisan/manage-orders"
                element={
                  <ProtectedRoute role="artisan">
                    <UnderProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favourites"
                element={
                  <ProtectedRoute role="artisan">
                    <UnderProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute >
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute >
                    <ProductPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/cart"
                element={
                  <ProtectedRoute  >
                    <UnderProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/orders"
                element={
                  <ProtectedRoute >
                    <UnderProduction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute >
                    <UnderProduction />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
           </Routes> 
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

const root = document.getElementById("root");
createRoot(root).render(<App />);
