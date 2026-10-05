//Starts HTTP server + central error handlingconst http = require("node:http");

const http = require("node:http");

const products = [
  { id: 1, name: "Oversized T-Shirt", category: "tshirts", price: 799 },
  { id: 2, name: "Slim Fit Shirt", category: "shirts", price: 1299 },
  { id: 3, name: "Floral Dress", category: "dresses", price: 1499 },
  { id: 4, name: "Running Shoes", category: "shoes", price: 1999 },
];

const server = http.createServer((req, res) => {
  try {
    if (req.method === "GET" && req.url === "/products") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(products));
    }
    if (req.method === "GET" && req.url.startsWith("/products/")) {
  const id = Number(req.url.split("/")[2]);

  const product = products.find((p) => p.id === id);

  if (!product) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Product not found" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(product));
}

if (req.method === "POST" && req.url === "/products") {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const newProduct = JSON.parse(body);

    newProduct.id = products.length + 1;
    products.push(newProduct);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newProduct));
  });

  return;
}
if (req.method === "GET" && req.url.startsWith("/products?")) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const category = url.searchParams.get("category");

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(filteredProducts));
}
if (req.method === "DELETE" && req.url.startsWith("/products/")) {
  const id = Number(req.url.split("/")[2]);

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Product not found" }));
  }

  const deletedProduct = products.splice(index, 1);

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(deletedProduct[0]));
}
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));

  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});