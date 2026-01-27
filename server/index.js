const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Expense = require("./models/Expense");

const expenseRoutes = require("./routes/expense.routes");




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/auth", require("./routes/auth.routes"));


app.use("/api/expenses", expenseRoutes);

app.use("/api/analytics", require("./routes/analytics.routes"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
