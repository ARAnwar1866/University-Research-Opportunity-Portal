const FIELDS = [
  'title', 'description', 'research_area', 'faculty_name',
  'department', 'required_skills', 'positions', 'deadline', 'status',
];
const REQUIRED = FIELDS.filter((f) => f !== 'status'); // status defaults to 'Open'
const TEXT_FIELDS = REQUIRED.filter((f) => f !== 'positions' && f !== 'deadline');

// Returns an array of error messages for the fields present in `body`.
function checkFields(body) {
  const errors = [];

  for (const f of TEXT_FIELDS) {
    if (body[f] !== undefined && (typeof body[f] !== 'string' || !body[f].trim())) {
      errors.push(`${f} must be a non-empty string`);
    }
  }
  if (body.positions !== undefined) {
    if (!Number.isInteger(body.positions) || body.positions < 1) {
      errors.push('positions must be a positive integer');
    }
  }
  if (body.deadline !== undefined) {
    const ok = typeof body.deadline === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(body.deadline)
      && !isNaN(new Date(body.deadline));
    if (!ok) errors.push('deadline must be a valid date in YYYY-MM-DD format');
  }
  if (body.status !== undefined && !['Open', 'Closed'].includes(body.status)) {
    errors.push("status must be either 'Open' or 'Closed'");
  }
  return errors;
}

function validateCreate(req, res, next) {
  const body = req.body || {};
  const errors = [];

  for (const f of REQUIRED) {
    if (body[f] === undefined || body[f] === null || body[f] === '') {
      errors.push(`${f} is required`);
    }
  }
  errors.push(...checkFields(body));

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
}

function validateUpdate(req, res, next) {
  const body = req.body || {};
  const provided = FIELDS.filter((f) => body[f] !== undefined);

  if (!provided.length) {
    return res.status(400).json({ error: 'Validation failed', details: ['Provide at least one field to update'] });
  }
  const errors = checkFields(body);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
}

function validateId(req, res, next) {
  if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  next();
}

module.exports = { validateCreate, validateUpdate, validateId, FIELDS };
