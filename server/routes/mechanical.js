const express = require("express");
const { pool } = require("../config/database");

const router = express.Router();

// GET /api/reports - List all reports
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM machine_reports WHERE jenis_perbaikan = 'Mekanik' ORDER BY id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/reports/:id - Get single report
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM machine_reports WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/reports - Create report
router.post("/", async (req, res) => {
  try {
    const {
      tanggal,
      waktu,
      shift,
      nama_pelapor,
      nama_mesin,
      plant,
      jenis_perbaikan,
      bagian_rusak,
      detail_kerusakan,
      status,
    } = req.body;
    // Validate required fields
    if (!tanggal || !waktu || !nama_pelapor || !nama_mesin || !plant) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const [result] = await pool.execute(
      `INSERT INTO machine_reports (
        tanggal, waktu, shift, nama_pelapor, nama_mesin, plant, jenis_perbaikan, bagian_rusak, detail_kerusakan, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tanggal,
        waktu,
        shift,
        nama_pelapor,
        nama_mesin,
        plant,
        jenis_perbaikan,
        bagian_rusak || null,
        detail_kerusakan || null,
        status || "New",
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/reports/:id - Update report
router.put("/:id", async (req, res) => {
  try {
    const {
      tanggal,
      waktu,
      shift,
      nama_pelapor,
      nama_mesin,
      plant,
      jenis_perbaikan,
      bagian_rusak,
      detail_kerusakan,
      status,
    } = req.body;
    // Validate required fields
    if (!tanggal || !waktu || !nama_pelapor || !nama_mesin || !plant) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    await pool.execute(
      `UPDATE machine_reports SET
        tanggal=?, waktu=?, shift=?, nama_pelapor=?, nama_mesin=?, plant=?, jenis_perbaikan=?, bagian_rusak=?, detail_kerusakan=?, status=?
      WHERE id=?`,
      [
        tanggal,
        waktu,
        shift,
        nama_pelapor,
        nama_mesin,
        plant,
        jenis_perbaikan,
        bagian_rusak || null,
        detail_kerusakan || null,
        status || "New",
        req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete("/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM machine_reports WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
