const db = require('../config/db');
const { FIELDS } = require('../middleware/validate');

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
  return rows[0];
}

// POST /api/opportunities
exports.createOpportunity = async (req, res, next) => {
  try {
    const b = req.body;
    const [result] = await db.query(
      `INSERT INTO opportunities
        (title, description, research_area, faculty_name, department,
         required_skills, positions, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.title.trim(), b.description.trim(), b.research_area.trim(),
        b.faculty_name.trim(), b.department.trim(), b.required_skills.trim(),
        b.positions, b.deadline, b.status || 'Open',
      ]
    );
    const created = await findById(result.insertId);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// GET /api/opportunities
exports.getAllOpportunities = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM opportunities ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/opportunities/:id
exports.getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.status(200).json(opportunity);
  } catch (err) {
    next(err);
  }
};

// PUT /api/opportunities/:id  (partial updates allowed, e.g. { "status": "Closed" })
exports.updateOpportunity = async (req, res, next) => {
  try {
    const existing = await findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Opportunity not found' });

    const updates = FIELDS.filter((f) => req.body[f] !== undefined);
    const setClause = updates.map((f) => `${f} = ?`).join(', ');
    const values = updates.map((f) =>
      typeof req.body[f] === 'string' ? req.body[f].trim() : req.body[f]
    );

    await db.query(`UPDATE opportunities SET ${setClause} WHERE id = ?`, [...values, req.params.id]);
    const updated = await findById(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/opportunities/:id
exports.deleteOpportunity = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM opportunities WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Opportunity not found' });
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    next(err);
  }
};
