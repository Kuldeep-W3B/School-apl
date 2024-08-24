const pool = require('../models/school'); // Assuming you exported the pool directly in your db file

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    try {
        const { rows: schools } = await pool.query('SELECT * FROM schools');
        const sortedSchools = schools.sort((a, b) => {
            const distanceA = calculateDistance(parseFloat(latitude), parseFloat(longitude), a.latitude, a.longitude);
            const distanceB = calculateDistance(parseFloat(latitude), parseFloat(longitude), b.latitude, b.longitude);
            return distanceA - distanceB;
        });
        res.json(sortedSchools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};
