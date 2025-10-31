const addBtn = document.getElementById('btn');
const popup = document.getElementById('popup-container');
const form = document.getElementById('person-form');
const table = document.getElementById('data-table');
const closePopup = document.getElementById('close-popup');
const deletePopup = document.getElementById('delete-popup');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const dobError = document.getElementById('dob-error');
const formError = document.getElementById('form-error');
let people = JSON.parse(localStorage.getItem('people')) || [];
let rowToDelete = null;
let editingIndex = null;
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}
document.getElementById('dob').addEventListener('change', (e) => {
  const dob = e.target.value;
  const today = new Date().toISOString().split('T')[0];

  if (dob > today) {
    dobError.style.display = 'block';
    document.getElementById('age').value = '';
    return;
  } else {
    dobError.style.display = 'none';
  }
  const age = calculateAge(dob);
  document.getElementById('age').value = age;
});
function renderTable() {
  table.querySelectorAll('tr:not(:first-child)').forEach(row => row.remove());

  if (people.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 7;
    cell.id = "no-data";
    cell.textContent = "No data found. Please enter data.";
    return;
  }
  people.forEach((p, index) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${p.fname}</td>
      <td>${p.lname}</td>
      <td>${p.age}</td>
      <td>${p.dob}</td>
      <td>${p.email}</td>
      <td>${p.comments}</td>
      <td>
        <button class="icon-btn edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="icon-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    row.querySelector('.edit-btn').addEventListener('click', () => editPerson(index));
    row.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(index));
  });
}
function saveData() {
  localStorage.setItem('people', JSON.stringify(people));
}
function openPopup() {
  popup.style.display = 'flex';
}
function closePopupForm() {
  popup.style.display = 'none';
  form.reset();
  dobError.style.display = 'none';
  formError.style.display = 'none';
  editingIndex = null;
  document.getElementById('submit-btn').textContent = 'Submit';
}

function editPerson(index) {
  const p = people[index];
  document.getElementById('fname').value = p.fname;
  document.getElementById('lname').value = p.lname;
  document.getElementById('age').value = p.age;
  document.getElementById('dob').value = p.dob;
  document.getElementById('email').value = p.email;
  document.getElementById('comments').value = p.comments;
  editingIndex = index;
  document.getElementById('submit-btn').textContent = 'Update';
  openPopup();
}

function confirmDelete(index) {
  rowToDelete = index;
  deletePopup.style.display = 'flex';
}

addBtn.addEventListener('click', openPopup);
closePopup.addEventListener('click', closePopupForm);
noBtn.addEventListener('click', () => deletePopup.style.display = 'none');
yesBtn.addEventListener('click', () => {
  if (rowToDelete !== null) {
    people.splice(rowToDelete, 1);
    saveData();
    renderTable();
    rowToDelete = null;
  }
  deletePopup.style.display = 'none';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const age = document.getElementById('age').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const email = document.getElementById('email').value.trim();
  const comments = document.getElementById('comments').value.trim();
  const today = new Date().toISOString().split('T')[0];

  dobError.style.display = 'none';
  formError.style.display = 'none';

  if (!fname || !lname || !age || !dob || !email || !comments) {
    formError.style.display = 'block';
    return;
  }

  if (dob > today) {
    dobError.style.display = 'block';
    return;
  }

  const newPerson = { fname, lname, age, dob, email, comments };

  if (editingIndex !== null) {
    people[editingIndex] = newPerson;
  } else {
    people.push(newPerson);
  }
  saveData();
  renderTable();
  closePopupForm();
});

renderTable();
