const goalForm = document.getElementById('goalForm');
const goalList = document.getElementById('goalList');
const exportBtn = document.getElementById('exportBtn');
const stepsList = document.getElementById('stepsList');
const stepInput = document.getElementById('stepInput');

let goals = JSON.parse(localStorage.getItem('goals')) || [];
let editIndex = null;
let tempSteps = [];

function renderGoals() {
  goalList.innerHTML = '';
  goals.forEach((goal, index) => {
    const div = document.createElement('div');
    div.classList.add('goal');

    let stepsHtml = '';
    if (goal.steps && goal.steps.length) {
      stepsHtml = '<ul>' + goal.steps.map(step => `<li>${step}</li>`).join('') + '</ul>';
    }

    div.innerHTML = `
      <h3>${goal.title}</h3>
      <p><strong>Target Date:</strong> ${goal.date}</p>
      <p>${goal.description || ''}</p>
      ${stepsHtml}
      <p class="status">${goal.status}</p>
      <button onclick="editGoal(${index})">Edit</button>
      <button onclick="deleteGoal(${index})">Delete</button>
    `;
    goalList.appendChild(div);
  });
  localStorage.setItem('goals', JSON.stringify(goals));
}

function addStep() {
  const step = stepInput.value.trim();
  if (step !== '') {
    tempSteps.push(step);
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
    stepInput.value = '';
  }
}

goalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;

  if (editIndex !== null) {
    goals[editIndex] = { title, date, description, status, steps: [...tempSteps] };
    editIndex = null;
  } else {
    goals.push({ title, date, description, status, steps: [...tempSteps] });
  }

  tempSteps = [];
  stepsList.innerHTML = '';
  renderGoals();
  goalForm.reset();
});

function deleteGoal(index) {
  goals.splice(index, 1);
  renderGoals()
