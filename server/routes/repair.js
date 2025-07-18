const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/repairs - List all repairs (for dashboard) or repairs for a specific report
router.get('/', async (req, res) => {
  try {
    const { report_id } = req.query;
    if (report_id) {
      // Get repairs for specific report
      const [rows] = await pool.execute('SELECT * FROM machine_repairs WHERE report_id = ? ORDER BY id DESC', [report_id]);
      res.json({ success: true, data: rows });
    } else {
      // Get all repairs for dashboard
      const [rows] = await pool.execute('SELECT * FROM machine_repairs ORDER BY id DESC');
      res.json({ success: true, data: rows });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/repairs/:id - Get a single repair
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM machine_repairs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/repairs - Create a new repair
router.post('/', async (req, res) => {
  try {
    const {
      report_id, detail_perbaikan, waktu_perbaikan_mulai, waktu_perbaikan_selesai, tanggal_selesai,
      spare_part, nama_teknisi, status, keterangan_tambahan
    } = req.body;
    if (!report_id) return res.status(400).json({ success: false, message: 'report_id is required' });
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the repair
      const [result] = await connection.execute(
        `INSERT INTO machine_repairs (
          report_id, detail_perbaikan, waktu_perbaikan_mulai, waktu_perbaikan_selesai, tanggal_selesai,
          spare_part, nama_teknisi, status, keterangan_tambahan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          report_id,
          detail_perbaikan || null,
          waktu_perbaikan_mulai || null,
          waktu_perbaikan_selesai || null,
          tanggal_selesai || null,
          spare_part || null,
          nama_teknisi || null,
          status || null,
          keterangan_tambahan || null
        ]
      );

      // Update report status based on repair status
      if (status === 'Selesai') {
        // If repair is completed, update report status to Selesai
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Selesai', report_id]
        );
      } else if (status === 'Proses') {
        // If repair is in progress, update report status to Proses
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Proses', report_id]
        );
      } else if (status === 'Pending') {
        // If repair is pending, update report status to Pending
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Pending', report_id]
        );
      }

      await connection.commit();
      res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/repairs/:id - Update a repair
router.put('/:id', async (req, res) => {
  try {
    const {
      detail_perbaikan, waktu_perbaikan_mulai, waktu_perbaikan_selesai, tanggal_selesai,
      spare_part, nama_teknisi, status, keterangan_tambahan
    } = req.body;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Get the repair to find the report_id
      const [repairRows] = await connection.execute(
        'SELECT report_id FROM machine_repairs WHERE id = ?',
        [req.params.id]
      );
      
      if (repairRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Repair not found' });
      }
      
      const report_id = repairRows[0].report_id;
      
      // Update the repair
      await connection.execute(
        `UPDATE machine_repairs SET
          detail_perbaikan=?, waktu_perbaikan_mulai=?, waktu_perbaikan_selesai=?, tanggal_selesai=?,
          spare_part=?, nama_teknisi=?, status=?, keterangan_tambahan=?
        WHERE id=?`,
        [
          detail_perbaikan || null,
          waktu_perbaikan_mulai || null,
          waktu_perbaikan_selesai || null,
          tanggal_selesai || null,
          spare_part || null,
          nama_teknisi || null,
          status || null,
          keterangan_tambahan || null,
          req.params.id
        ]
      );

      // Update report status based on repair status
      if (status === 'Selesai') {
        // If repair is completed, update report status to Selesai
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Selesai', report_id]
        );
      } else if (status === 'Proses') {
        // If repair is in progress, update report status to Proses
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Proses', report_id]
        );
      } else if (status === 'Pending') {
        // If repair is pending, update report status to Pending
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['Pending', report_id]
        );
      }

      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/repairs/:id - Delete a repair
router.delete('/:id', async (req, res) => {
  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Get the repair to find the report_id
      const [repairRows] = await connection.execute(
        'SELECT report_id FROM machine_repairs WHERE id = ?',
        [req.params.id]
      );
      
      if (repairRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: 'Repair not found' });
      }
      
      const report_id = repairRows[0].report_id;
      
      // Delete the repair
      await connection.execute('DELETE FROM machine_repairs WHERE id = ?', [req.params.id]);
      
      // Check if there are any remaining repairs for this report
      const [remainingRepairs] = await connection.execute(
        'SELECT COUNT(*) as count FROM machine_repairs WHERE report_id = ?',
        [report_id]
      );
      
      // If no repairs remain, set report status back to New
      if (remainingRepairs[0].count === 0) {
        await connection.execute(
          'UPDATE machine_reports SET status = ? WHERE id = ?',
          ['New', report_id]
        );
      } else {
        // If repairs remain, check the highest priority status
        const [repairStatuses] = await connection.execute(
          'SELECT status FROM machine_repairs WHERE report_id = ? ORDER BY FIELD(status, "Selesai", "Proses", "Pending") DESC LIMIT 1',
          [report_id]
        );
        
        if (repairStatuses.length > 0) {
          await connection.execute(
            'UPDATE machine_reports SET status = ? WHERE id = ?',
            [repairStatuses[0].status, report_id]
          );
        }
      }
      
      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 