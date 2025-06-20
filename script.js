const goalForm = document.getElementById('goalForm');
const goalList = document.getElementById('goalList');
const exportBtn = document.getElementById('exportBtn');

let goals = JSON.parse(localStorage.getItem('goals')) || [];
let editIndex = null; // <--- śledzi, który cel jest edytowany

function renderGoals() {
  goalList.innerHTML = '';
  goals.forEach((goal, index) => {
    const div = document.createElement('div');
    div.classList.add('goal');
    div.innerHTML = `
      <h3>${goal.title}</h3>
      <p><strong>Data docelowa:</strong> ${goal.date}</p>
      <p>${goal.description || ''}</p>
      <p class="status">${goal.status}</p>
      <button onclick="editGoal(${index})">Edytuj</button>
      <button onclick="deleteGoal(${index})">Usuń</button>
    `;
    goalList.appendChild(div);
  });
  localStorage.setItem('goals', JSON.stringify(goals));
}

goalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;

  if (editIndex !== null) {
    // Tryb edycji
    goals[editIndex] = { title, date, description, status };
    editIndex = null;
  } else {
    // Dodawanie nowego celu
    goals.push({ title, date, description, status });
  }

  renderGoals();
  goalForm.reset();
});

function deleteGoal(index) {
  goals.splice(index, 1);
  renderGoals();
}

function editGoal(index) {
  const goal = goals[index];
  document.getElementById('title').value = goal.title;
  document.getElementById('date').value = goal.date;
  document.getElementById('description').value = goal.description;
  document.getElementById('status').value = goal.status;
  editIndex = index;
}

exportBtn.addEventListener('click', () => {
  const opt = {
    margin: 0.5,
    filename: 'kamienie-milowe.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(goalList).set(opt).save();
});

renderGoals();
