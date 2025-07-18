const express = require('express');
const { pool } = require('../config/database');
const ExcelJS = require('exceljs');

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// GET /api/stats - Get application statistics
router.get('/stats', async (req, res) => {
  try {
    const [reportCount] = await pool.execute('SELECT COUNT(*) as count FROM machine_reports');
    const [repairCount] = await pool.execute('SELECT COUNT(*) as count FROM machine_repairs');

    res.json({
      success: true,
      data: {
        total_reports: reportCount[0].count,
        total_repairs: repairCount[0].count,
        server_status: 'running',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// GET /api/export/excel - Download all reports and repairs as Excel
router.get('/export/excel', async (req, res) => {
  try {
    const { month, year } = req.query;
    let reportQuery = 'SELECT * FROM machine_reports';
    let repairQuery = 'SELECT * FROM machine_repairs';
    const reportParams = [];
    const repairParams = [];

    if (month && year) {
      reportQuery += ' WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?';
      repairQuery += ' WHERE MONTH(tanggal_selesai) = ? AND YEAR(tanggal_selesai) = ?';
      reportParams.push(month, year);
      repairParams.push(month, year);
    } else if (year) {
      reportQuery += ' WHERE YEAR(tanggal) = ?';
      repairQuery += ' WHERE YEAR(tanggal_selesai) = ?';
      reportParams.push(year);
      repairParams.push(year);
    }
    reportQuery += ' ORDER BY id';
    repairQuery += ' ORDER BY id';

    const [reports] = await pool.execute(reportQuery, reportParams);
    const [repairs] = await pool.execute(repairQuery, repairParams);

    // Map repairs by report_id
    const repairsByReport = {};
    repairs.forEach(r => {
      if (!repairsByReport[r.report_id]) repairsByReport[r.report_id] = [];
      repairsByReport[r.report_id].push(r);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('WO Combined');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Tanggal', key: 'tanggal', width: 15 },
      { header: 'Waktu', key: 'waktu', width: 12 },
      { header: 'Shift', key: 'shift', width: 10 },
      { header: 'Nama Pelapor', key: 'nama_pelapor', width: 20 },
      { header: 'Nama Mesin', key: 'nama_mesin', width: 20 },
      { header: 'Plant', key: 'plant', width: 10 },
      { header: 'Bagian Rusak', key: 'bagian_rusak', width: 20 },
      { header: 'Detail Kerusakan', key: 'detail_kerusakan', width: 30 },
      { header: 'Detail Perbaikan', key: 'detail_perbaikan', width: 30 },
      { header: 'Spare Part', key: 'spare_part', width: 20 },
      { header: 'Waktu Mulai Perbaikan', key: 'waktu_perbaikan_mulai', width: 15 },
      { header: 'Waktu Selesai Perbaikan', key: 'waktu_perbaikan_selesai', width: 15 },
      { header: 'Tanggal Selesai', key: 'tanggal_selesai', width: 15 },
    ];

    // Helper to format date/time
    const fmtDate = d => d ? new Date(d).toLocaleDateString('en-GB') : '';
    const fmtTime = t => t ? t.toString().slice(0, 8) : '';

    for (const report of reports) {
      const repList = repairsByReport[report.id] || [];
      if (repList.length === 0) {
        // No repairs, just show report data
        sheet.addRow({
          id: report.id,
          tanggal: fmtDate(report.tanggal),
          waktu: fmtTime(report.waktu),
          shift: report.shift,
          nama_pelapor: report.nama_pelapor,
          nama_mesin: report.nama_mesin,
          plant: report.plant,
          bagian_rusak: report.bagian_rusak,
          detail_kerusakan: report.detail_kerusakan,
          detail_perbaikan: '',
          spare_part: '',
          waktu_perbaikan_mulai: '',
          waktu_perbaikan_selesai: '',
          tanggal_selesai: '',
        });
      } else {
        for (const repair of repList) {
          sheet.addRow({
            id: report.id,
            tanggal: fmtDate(report.tanggal),
            waktu: fmtTime(report.waktu),
            shift: report.shift,
            nama_pelapor: report.nama_pelapor,
            nama_mesin: report.nama_mesin,
            plant: report.plant,
            bagian_rusak: report.bagian_rusak,
            detail_kerusakan: report.detail_kerusakan,
            detail_perbaikan: repair.detail_perbaikan,
            spare_part: repair.spare_part,
            waktu_perbaikan_mulai: fmtTime(repair.waktu_perbaikan_mulai),
            waktu_perbaikan_selesai: fmtTime(repair.waktu_perbaikan_selesai),
            tanggal_selesai: fmtDate(repair.tanggal_selesai),
          });
        }
      }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="wo_export.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/technicians - Get all technicians
router.get('/technicians', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT nik, nama FROM technicians ORDER BY nama ASC');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technicians',
      error: error.message
    });
  }
});

module.exports = router; 