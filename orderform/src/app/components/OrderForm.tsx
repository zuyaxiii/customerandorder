import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api/axiosInstance";
import { Customer } from "../utils/api/types/customer";
import axios from "axios";

const OrderForm = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [product, setProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get<Customer[]>("/customers");
        setCustomers(data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
  
    try {

      if (!product || !quantity || !price || !customerId) {
        throw new Error("All fields are required");
      }
  
      const formData = new FormData();
  
      const quantityNum = parseInt(quantity);
      const priceNum = parseFloat(price.replace(/,/g, ""));
  
      if (isNaN(quantityNum) || quantityNum <= 0) {
        throw new Error("Invalid quantity");
      }
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error("Invalid price");
      }
  
      formData.append("product", product.trim());
      formData.append("quantity", quantityNum.toString());
      formData.append("price", priceNum.toString());
      formData.append("customerId", customerId ? customerId.toString() : "0");
  
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("file", ""); 
      }
  
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      await axiosInstance.post("/orders", formData);
  
      setMessage("Order created successfully!");
      setProduct("");
      setQuantity("");
      setPrice("");
      setCustomerId(null);
      setFile(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to create order");
        console.error("API Error:", error.response?.data);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Create Order
      </h3>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}
      {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product
        </label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter product name"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter quantity"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price
        </label>
        <input
          type="text"
          value={price}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d,]/g, "");
            if (value) {
              const num = parseFloat(value.replace(/,/g, ""));
              if (!isNaN(num)) {
                setPrice(new Intl.NumberFormat().format(num));
              }
            } else {
              setPrice("");
            }
          }}
          required
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter price"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer
        </label>
        <select
          value={customerId || ""}
          onChange={(e) => setCustomerId(Number(e.target.value))}
          required
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Customer (Email)</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.email}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload File (Optional)
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Order"}
      </button>
    </form>
  );
};

export default OrderForm;