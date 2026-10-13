const $ = (id) => document.getElementById(id);
const detailsModal = new bootstrap.Modal($('detailsModal'));
const formModal = new bootstrap.Modal($('formModal'));
let opportunities = [];
let editingId = null;

function esc(text) {
  const d = document.createElement('div');
  d.textContent = text ?? '';
  return d.innerHTML;
}

function showAlert(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `alert alert-${type} alert-dismissible fade show`;
  el.innerHTML = `${esc(message)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  $('alerts').appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

const badge = (status) =>
  `<span class="badge ${status === 'Open' ? 'bg-success' : 'bg-secondary'}">${esc(status)}</span>`;

// ---------- List ----------
function renderList() {
  if (!opportunities.length) {
    $('list').innerHTML = '<p class="text-muted">No research opportunities yet. Click "New Opportunity" to add one.</p>';
    return;
  }
  $('list').innerHTML = opportunities.map((o) => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${esc(o.title)}</h5>${badge(o.status)}
          </div>
          <p class="mb-1"><strong>Area:</strong> ${esc(o.research_area)}</p>
          <p class="mb-1"><strong>Faculty:</strong> ${esc(o.faculty_name)}</p>
          <p class="mb-1"><strong>Positions:</strong> ${o.positions}</p>
          <p class="mb-0"><strong>Deadline:</strong> ${esc(o.deadline)}</p>
        </div>
        <div class="card-footer d-flex flex-wrap gap-1">
          <button class="btn btn-sm btn-outline-primary" data-action="view" data-id="${o.id}">View</button>
          <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${o.id}">Edit</button>
          ${o.status === 'Open'
            ? `<button class="btn btn-sm btn-outline-warning" data-action="close" data-id="${o.id}">Close</button>` : ''}
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${o.id}">Delete</button>
        </div>
      </div>
    </div>`).join('');
}

async function loadOpportunities() {
  try {
    opportunities = await api.getAll();
    renderList();
  } catch (err) {
    showAlert(err.message, 'danger');
  }
}

// ---------- Details ----------
async function showDetails(id) {
  try {
    const o = await api.getOne(id);
    $('detailsTitle').innerHTML = `${esc(o.title)} ${badge(o.status)}`;
    $('detailsBody').innerHTML = `
      <p>${esc(o.description)}</p>
      <dl class="row mb-0">
        <dt class="col-sm-4">Research Area</dt><dd class="col-sm-8">${esc(o.research_area)}</dd>
        <dt class="col-sm-4">Faculty Member</dt><dd class="col-sm-8">${esc(o.faculty_name)}</dd>
        <dt class="col-sm-4">Department</dt><dd class="col-sm-8">${esc(o.department)}</dd>
        <dt class="col-sm-4">Required Skills</dt><dd class="col-sm-8">${esc(o.required_skills)}</dd>
        <dt class="col-sm-4">Available Positions</dt><dd class="col-sm-8">${o.positions}</dd>
        <dt class="col-sm-4">Application Deadline</dt><dd class="col-sm-8">${esc(o.deadline)}</dd>
      </dl>`;
    detailsModal.show();
  } catch (err) {
    showAlert(err.message, 'danger');
    if (err.status === 404) loadOpportunities();
  }
}

// ---------- Create / edit form ----------
function buildForm() {
  $('formFields').innerHTML = FIELDS.map((f) => `
    <div class="mb-3">
      <label class="form-label" for="f_${f.name}">${f.label} *</label>
      ${f.type === 'textarea'
        ? `<textarea class="form-control" id="f_${f.name}" rows="3"></textarea>`
        : `<input class="form-control" id="f_${f.name}" type="${f.type}" ${f.type === 'number' ? 'min="1"' : ''}>`}
      <div class="invalid-feedback" id="e_${f.name}"></div>
    </div>`).join('');
}

function openForm(o = null) {
  editingId = o ? o.id : null;
  $('formTitle').textContent = o ? 'Edit Opportunity' : 'New Opportunity';
  $('formError').innerHTML = '';
  $('statusWrap').classList.toggle('d-none', !o);
  FIELDS.forEach((f) => {
    $('f_' + f.name).value = o ? o[f.name] : '';
    $('f_' + f.name).classList.remove('is-invalid');
  });
  $('f_status').value = o ? o.status : 'Open';
  formModal.show();
}

$('oppForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const values = {};
  FIELDS.forEach((f) => { values[f.name] = $('f_' + f.name).value.trim(); });

  const errors = validateForm(values);
  FIELDS.forEach((f) => {
    $('f_' + f.name).classList.toggle('is-invalid', !!errors[f.name]);
    $('e_' + f.name).textContent = errors[f.name] || '';
  });
  if (Object.keys(errors).length) return;

  const payload = { ...values, positions: Number(values.positions) };
  try {
    if (editingId) {
      payload.status = $('f_status').value;
      await api.update(editingId, payload);
      showAlert('Opportunity updated successfully.');
    } else {
      await api.create(payload);
      showAlert('Opportunity created successfully.');
    }
    formModal.hide();
    loadOpportunities();
  } catch (err) {
    const details = err.details ? `<ul class="mb-0">${err.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : '';
    $('formError').innerHTML = `<div class="alert alert-danger">${esc(err.message)}${details}</div>`;
  }
});

// ---------- Card buttons ----------
$('list').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  try {
    switch (btn.dataset.action) {
      case 'view':
        await showDetails(id);
        break;
      case 'edit':
        openForm(await api.getOne(id));
        break;
      case 'close':
        await api.update(id, { status: 'Closed' });
        showAlert('Opportunity closed.');
        loadOpportunities();
        break;
      case 'delete':
        if (!confirm('Delete this opportunity permanently?')) return;
        await api.remove(id);
        showAlert('Opportunity deleted.');
        loadOpportunities();
        break;
    }
  } catch (err) {
    showAlert(err.message, 'danger');
    if (err.status === 404) loadOpportunities();
  }
});

$('addBtn').addEventListener('click', () => openForm());

buildForm();
loadOpportunities();
