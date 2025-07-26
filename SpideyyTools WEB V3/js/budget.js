// Freelancer Budget Tracker JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const budgetForm = document.getElementById('budget-form');
  const entryTypeSelect = document.getElementById('entry-type');
  const entryDescriptionInput = document.getElementById('entry-description');
  const entryAmountInput = document.getElementById('entry-amount');
  const totalIncomeElem = document.getElementById('total-income');
  const totalExpensesElem = document.getElementById('total-expenses');
  const balanceElem = document.getElementById('balance');
  const entriesList = document.getElementById('entries-list');
  const ctx = document.getElementById('budget-chart').getContext('2d');

  let entries = JSON.parse(localStorage.getItem('spideyytools_budget_entries')) || [];

  let chart;

  function saveEntries() {
    localStorage.setItem('spideyytools_budget_entries', JSON.stringify(entries));
  }

  function renderEntries() {
    entriesList.innerHTML = '';

    if (entries.length === 0) {
      entriesList.innerHTML = '<p>No entries yet.</p>';
      return;
    }

    entries.forEach((entry, index) => {
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';

      const desc = document.createElement('div');
      desc.className = 'entry-description';
      desc.textContent = entry.description;

      const amount = document.createElement('div');
      amount.className = 'entry-amount ' + (entry.type === 'income' ? 'entry-income' : 'entry-expense');
      amount.textContent = `$${entry.amount.toFixed(2)}`;

      const actions = document.createElement('div');
      actions.className = 'entry-actions';

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.title = 'Delete entry';
      deleteBtn.addEventListener('click', () => {
        deleteEntry(index);
      });

      actions.appendChild(deleteBtn);

      entryItem.appendChild(desc);
      entryItem.appendChild(amount);
      entryItem.appendChild(actions);

      entriesList.appendChild(entryItem);
    });
  }

  function updateSummary() {
    const totalIncome = entries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = entries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalIncome - totalExpenses;

    totalIncomeElem.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesElem.textContent = `$${totalExpenses.toFixed(2)}`;
    balanceElem.textContent = `$${balance.toFixed(2)}`;

    updateChart(totalIncome, totalExpenses);
  }

  function updateChart(income, expenses) {
    const data = {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [income, expenses],
        backgroundColor: ['#43b581', '#e06c75'],
        hoverOffset: 10
      }]
    };

    if (chart) {
      chart.data = data;
      chart.update();
    } else {
      chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#ddd',
                font: {
                  family: "'Fira Code', monospace",
                  size: 14
                }
              }
            }
          }
        }
      });
    }
  }

  function addEntry(type, description, amount) {
    entries.push({ type, description, amount });
    saveEntries();
    renderEntries();
    updateSummary();
  }

  function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
      entries.splice(index, 1);
      saveEntries();
      renderEntries();
      updateSummary();
    }
  }

  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = entryTypeSelect.value;
    const description = entryDescriptionInput.value.trim();
    const amount = parseFloat(entryAmountInput.value);

    if (!description || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid description and amount.');
      return;
    }

    addEntry(type, description, amount);

    entryDescriptionInput.value = '';
    entryAmountInput.value = '';
  });

  // Initial render
  renderEntries();
  updateSummary();
});
