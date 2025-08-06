const express = require("express");
const { pool } = require("../config/database");

const router = express.Router();

// GET /api/machines - List all machines
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM machines ORDER BY name ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/machines/:id - Get single machine
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM machines WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/machines - Create machine
router.post("/", async (req, res) => {
  try {
    const { plant, name } = req.body;
    // Validate required fields
    if (!plant || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const [result] = await pool.execute(
      `INSERT INTO machines (plant, name) VALUES (?, ?)`,
      [plant, name]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/machines/:id - Update machine
router.put("/:id", async (req, res) => {
  try {
    const { plant, name } = req.body;
    // Validate required fields
    if (!plant || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const [result] = await pool.execute(
      `UPDATE machines SET plant = ?, name = ? WHERE id = ?`,
      [plant, name, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Machine updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/machines/:id - Delete machine
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM machines WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export the router
module.exports = router;
