const FIELDS = [
  { name: 'title', label: 'Research Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'research_area', label: 'Research Area', type: 'text' },
  { name: 'faculty_name', label: 'Faculty Member Name', type: 'text' },
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'required_skills', label: 'Required Skills', type: 'text' },
  { name: 'positions', label: 'Available Positions', type: 'number' },
  { name: 'deadline', label: 'Application Deadline', type: 'date' },
];

// Returns an object like { title: 'Research Title is required' }; empty if valid.
function validateForm(values) {
  const errors = {};
  FIELDS.forEach((f) => {
    if (!values[f.name]) errors[f.name] = `${f.label} is required`;
  });
  if (values.positions && (!Number.isInteger(Number(values.positions)) || Number(values.positions) < 1)) {
    errors.positions = 'Positions must be a whole number of at least 1';
  }
  return errors;
}
