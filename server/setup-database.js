const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'devuser',
    password: 'devuser',
    port: 3306
  });

  try {
    console.log('🔧 Setting up database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS wo_app');
    await connection.query('USE wo_app');

    // Create machine_reports table (damage reports)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS machine_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tanggal DATE NOT NULL,
        waktu TIME NOT NULL,
        shift VARCHAR(16) NOT NULL,
        nama_pelapor VARCHAR(100) NOT NULL,
        nama_mesin VARCHAR(100) NOT NULL,
        plant VARCHAR(100) NOT NULL,
        bagian_rusak VARCHAR(255),
        detail_kerusakan TEXT,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ machine_reports table created/verified');

    // Add status column to existing machine_reports table if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE machine_reports 
        ADD COLUMN status VARCHAR(50) DEFAULT 'New'
      `);
      console.log('✅ Added status column to machine_reports table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Status column already exists in machine_reports table');
      } else {
        console.log('ℹ️  Status column handling:', error.message);
      }
    }

    // Create machine_repairs table (repairs, one-to-many with reports)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS machine_repairs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        detail_perbaikan TEXT,
        waktu_perbaikan_mulai TIME,
        waktu_perbaikan_selesai TIME,
        tanggal_selesai DATE,
        spare_part VARCHAR(100),
        nama_teknisi TEXT,
        status VARCHAR(50),
        keterangan_tambahan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES machine_reports(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ machine_repairs table created/verified');

    // Alter machine_repairs.nama_teknisi to TEXT for multiple technicians
    try {
      await connection.execute(`
        ALTER TABLE machine_repairs 
        MODIFY COLUMN nama_teknisi TEXT
      `);
      console.log('✅ Altered nama_teknisi to TEXT in machine_repairs');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME' || error.message.includes('Duplicate column name')) {
        console.log('ℹ️  nama_teknisi already TEXT');
      } else if (error.message.includes('check that column/key exists')) {
        console.log('ℹ️  nama_teknisi column already correct type');
      } else {
        console.log('ℹ️  nama_teknisi alter handling:', error.message);
      }
    }

    // Create technicians table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS technicians (
        nik VARCHAR(16) PRIMARY KEY,
        nama VARCHAR(100) NOT NULL
      )
    `);
    console.log('✅ technicians table created/verified');

    // Insert initial technician data
    const technicians = [
      ['001436', 'SUYANTO'],
      ['000609', 'SAMIJAN'],
      ['002657', 'FAISAL.K'],
      ['000388', 'SUGENG'],
      ['001498', 'ARIF ARYANTO'],
      ['000843', 'RUSWIDI JOKO'],
      ['002997', 'HANI ADNANI'],
      ['001033', 'TEDDY JHONY WN'],
      ['002748', 'AGGRIS YAYIT.T'],
      ['003588', 'M.ASAD RAMADHAN'],
      ['003575', 'ANDHI KURNIASYAH'],
      ['003576', 'WAHYUDIN'],
      ['000569', 'TARMONO'],
      ['003706', 'SUAR SAPTO'],
      ['000438', 'ALI MUSTOFA'],
      ['003591', 'ENDANG MULYADI'],
      ['003589', 'ARI MUHODARI'],
      ['000841', 'TURIMAN'],
      ['001375', 'BUDIYANTO'],
      ['003280', 'RIYAN INDRIYANA RAHARDI'],
      ['003312', 'DEDI HARYAWAN'],
      ['000844', 'UJANG SUDRAJAT'],
      ['002291', 'DONI RAMADONI'],
      ['002798', 'RAHMAT HIDAYAT'],
      ['003609', 'FIRMAN HIDAYAT'],
      ['003610', 'M.AZIZ TOYIBIIN'],
      ['001499', 'BUSTAMI'],
      ['003312', 'ROHMAN'],
      ['000599', 'YULIMANSYAH'],
      ['003127', 'SUJARWO'],
      ['001072', 'SUYATNO'],
      ['000856', 'KASIMIN'],
      ['000830', 'BAKTI SUDARMONO'],
      ['000826', 'M.BASORI'],
      ['003548', 'AGUNG SUSENO'],
      ['000796', 'WIDODO'],
      ['001678', 'YAKUB'],
      ['003642', 'SUKINO'],
      ['003642', 'AWALUDIN .F'],
      ['000928', 'SUPARTA'],
    ];
    for (const [nik, nama] of technicians) {
      await connection.execute(
        'INSERT IGNORE INTO technicians (nik, nama) VALUES (?, ?)',
        [nik, nama]
      );
    }
    console.log('✅ technicians data inserted');

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Database: wo_app');
    console.log('🔗 Ready to connect from your application');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
