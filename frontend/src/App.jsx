import { useEffect, useState } from "react";
import "./App.css";
import { Table } from "antd";
import axios from "axios";

function App() {
  const [products, setProducts] = useState();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
  ];

  useEffect(() => {
    console.log("import.meta.env.VITE_POD_IP"+import.meta.env.VITE_POD_IP);
    console.log("import.meta.env.VITE_POD_NAME"+import.meta.env.VITE_POD_NAME);
    console.log("import.meta.env.VITE_POD_NAME_SECOND"+import.meta.env.VITE_POD_NAME_SECOND);
    console.log("import.meta.env.VITE_POD_NAME_THIRD"+import.meta.env.VITE_POD_NAME_THIRD);
    console.log("import.meta.env.VITE_POD_NAME_FORTH"+import.meta.env.VITE_POD_NAME_FORTH);
    const podIp = import.meta.env.VITE_POD_IP || "localhost:5000";  
    axios
      .get(`http://finalproject1.localdev.me:30000/products`)
      .then((e) => setProducts(e.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Product</h1>
      {products && <Table dataSource={products} columns={columns} />}
    </div>
  );
}

export default App;
