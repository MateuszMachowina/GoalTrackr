const goalForm = document.getElementById('goalForm');
const goalList = document.getElementById('goalList');
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
      stepsHtml = '<ul>' + goal.steps.map(step => <li>${step}</li>).join('') + '</ul>';
    }

    div.innerHTML = 
      <h3>${goal.title}</h3>
      <p><strong>Target Date:</strong> ${goal.date}</p>
      <p>${goal.description || ''}</p>
      ${stepsHtml}
      <p class="status">${goal.status}</p>
      <button onclick="editGoal(${index})">Edit</button>
      <button onclick="deleteGoal(${index})">Delete</button>
    ;
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
  renderGoals();
}

function editGoal(index) {
  const goal = goals[index];
  document.getElementById('title').value = goal.title;
  document.getElementById('date').value = goal.date;
  document.getElementById('description').value = goal.description;
  document.getElementById('status').value = goal.status;
  tempSteps = [...goal.steps];
  stepsList.innerHTML = '';
  tempSteps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
  });
  editIndex = index;
}

async function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('My Goals', 14, y);
  y += 10;

  goals.forEach((goal, index) => {
    doc.setFontSize(14);
    doc.text(${index + 1}. ${goal.title}, 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(Target Date: ${goal.date}, 14, y);
    y += 6;
    doc.text(Status: ${goal.status}, 14, y);
    y += 6;
    if (goal.description) {
      const descLines = doc.splitTextToSize(goal.description, 180);
      doc.text(descLines, 14, y);
      y += descLines.length * 6;
    }
    if (goal.steps && goal.steps.length > 0) {
      doc.text('Steps:', 14, y);
      y += 6;
      goal.steps.forEach((step) => {
        doc.text(- ${step}, 18, y);
        y += 6;
      });
    }
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('goals.pdf');
}

renderGoals();
