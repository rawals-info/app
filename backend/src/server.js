const cors = require("cors")
const express = require("express")

const { sequelize } = require("./config/database")
const bloodSugarRoutes = require("./routes/bloodSugarRoutes")
const exerciseRoutes = require("./routes/exerciseRoutes")
const foodLogRoutes = require("./routes/foodLogRoutes")
const recommendationRoutes = require("./routes/recommendationRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/blood-sugar", bloodSugarRoutes)
app.use("/api/food-logs", foodLogRoutes)
app.use("/api/exercises", exerciseRoutes)
app.use("/api/recommendations", recommendationRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok" })
})

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.sync({ alter: false })
    console.log("Database connection established successfully.")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to connect to the database:", error)
    process.exit(1)
  }
}

startServer()
