import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CartContext } from "../../context/CartContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosClient from "../../context/axiosClient";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import "../../../css/style.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const PRODUCTS_PER_PAGE = 24;
  const [displayedProductCount, setDisplayedProductCount] = useState(PRODUCTS_PER_PAGE);
  const hasMoreProducts = displayedProductCount < filteredProducts.length;

  useEffect(() => {
    document.title = "Products | MyShop";
    fetchProducts();
  }, []);

  useEffect(() => {
    let sortedProducts = [...products];
    if (sortOrder === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else {
      sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const filtered = sortedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setDisplayedProductCount(PRODUCTS_PER_PAGE); // Reset count on search/sort change
  }, [searchTerm, sortOrder, products]);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/api/frontend/products");
      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
      setDisplayedProductCount(PRODUCTS_PER_PAGE); // Initialize displayed count
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayedProductCount((prevCount) => prevCount + PRODUCTS_PER_PAGE);
  };

  const handleAddToCart = async (product) => {
    await addToCart(product.id);
    alert(`${product.name} added to cart`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Container className="mt-5 flex-grow-1">
        <h2 className="mb-4 text-center">Our Products</h2>
        <Row className="mb-4">
          <Col md={6}>
            <FormControl
              type="text"
              placeholder="Search products..."
              className="mr-sm-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <Form.Select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              style={{ width: "200px" }}
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Form.Select>
          </Col>
        </Row>
        <Row>
          {filteredProducts.slice(0, displayedProductCount).map((product) => (
            <Col md={4} lg={3} className="mb-4" key={product.id}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img
                  variant="top"
                  src={`/uploads/products/${product.image}`}
                  alt={product.name}
                  className="product-img"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted">${product.price}</Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="my-4">
          <Col className="text-center">
            {hasMoreProducts && (
              <Button onClick={handleLoadMore} variant="info">
                Load More Products
              </Button>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Products;
