// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const fs = require("fs");
const path = require("path");

// Check if db.json exists
const dbPath = path.join(__dirname, "db.json");
if (!fs.existsSync(dbPath)) {
  console.log("Creating db.json file with sample data...");
  fs.writeFileSync(
    dbPath,
    JSON.stringify(
      {
        todos: [
          {
            id: "1",
            text: "Learn Angular",
            description: "Complete the Angular tutorial",
            status: "InProgress",
          },
        ],
      },
      null,
      2,
    ),
  );
}

// Set default middlewares
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/api/echo", (req, res) => {
  res.jsonp({
    message: "JSON Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Add delay to simulate network latency
server.use((req, res, next) => {
  setTimeout(next, 300 + Math.random() * 700);
});

// Use JSON Server router with /api prefix
server.use("/api", router);

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
✅ JSON Server is running on http://localhost:${PORT}
📊 Available endpoints:
  GET    /api/todos
  GET    /api/todos/:id
  POST   /api/todos
  PUT    /api/todos/:id
  PATCH  /api/todos/:id
  DELETE /api/todos/:id
  GET    /api/echo

📁 Database file: ${dbPath}
`);
});
