// resources/js/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    price: "",
    compare_at_price: "",
    image: null,
    active: true,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/backend/products");
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/backend/categories-list");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm({ ...form, name: value, slug });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        category_id: product.category_id || "",
        price: product.price || "",
        compare_at_price: product.compare_at_price || "",
        image: null,
        active: product.active ?? true,
      });
    } else {
      setEditingProduct(null);
      setForm({
        name: "",
        slug: "",
        category_id: "",
        price: "",
        compare_at_price: "",
        image: null,
        active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Save product
    const saveProduct = async () => {
    try {
        setSaving(true);
        const formDataObj = new FormData();
        formDataObj.append("name", form.name);
        formDataObj.append("slug", form.slug);
        formDataObj.append("category_id", parseInt(form.category_id) || "");
        formDataObj.append("price", form.price || "");
        formDataObj.append("compare_at_price", form.compare_at_price || "");
        formDataObj.append("active", form.active ? 1 : 0);
        if (form.image) formDataObj.append("image", form.image);

        if (editingProduct) {
        await axios.post(
            `/api/backend/products/${editingProduct.id}?_method=PUT`,
            formDataObj,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        } else {
        await axios.post("/api/backend/products", formDataObj, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        }

        // REFRESH PRODUCTS LIST
        await fetchProducts();

        closeModal();
    } catch (err) {
        console.error("Error saving product:", err.response?.data || err);
        alert("Failed to save product. Check console for details.");
    } finally {
        setSaving(false);
    }
    };


  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/backend/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <Button onClick={() => openModal()}>+ Add Product</Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Image</th>
              <th>Category</th>
              <th>Price</th>
              <th>Compare At Price</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.slug}</td>
                  <td>
                    {product.image ? (
                        <img
                        src={`/uploads/products/${product.image}`}
                        alt={product.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                        />
                    ) : (
                        "—"
                    )}
                  </td>
                  <td>{product.category?.name || "—"}</td>
                  <td>{product.price}</td>
                  <td>{product.compare_at_price || "—"}</td>
                  <td>{product.active ? "Yes" : "No"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => openModal(product)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control type="text" name="slug" value={form.slug} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category_id"
                value={String(form.category_id)}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Compare At Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="compare_at_price"
                value={form.compare_at_price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3 form-check">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveProduct} disabled={saving}>
            {saving ? "Saving..." : editingProduct ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;
