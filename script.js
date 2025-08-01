const form = document.getElementById('transaction-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const resetBtn = document.getElementById('reset');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editId = null;

form.addEventListener('submit', addTransaction);
resetBtn.addEventListener('click', () => {
  descInput.value = '';
  amountInput.value = '';
  editId = null;
});

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener('change', renderTransactions);
});

// function addTransaction(e) {
//   e.preventDefault();
//   const description = descInput.value.trim();
// const amount = +amountInput.value; 
// if (!description || isNaN(amount)) return;

//   if (editId) {
//     const txn = transactions.find(t => t.id === editId);
//     txn.description = description;
//     txn.amount = amount;
//     editId = null;
//   } else {
//     transactions.push({
//       id: Date.now(),
//       description,
//       amount
//     });
//   }

//   updateStorage();
//   renderTransactions();
//   form.reset();
// }



function addTransaction(e) {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = +amountInput.value;

  if (!description || isNaN(amount)) return;

  if (editId) {
    const txn = transactions.find(t => t.id === editId);
    txn.description = description;
    txn.amount = amount;
    editId = null;
  } else {
    transactions.push({
      id: Date.now(),
      description,
      amount
    });
  }

  updateStorage();
  renderTransactions();
  form.reset();
}


function renderTransactions() {
  list.innerHTML = '';
  const filter = document.querySelector('input[name="filter"]:checked').value;
  const filtered = transactions.filter(txn =>
    filter === 'all' ? true :
    filter === 'income' ? txn.amount > 0 :
    txn.amount < 0
  );

  filtered.forEach(txn => {
    const item = document.createElement('li');
    item.classList.add(txn.amount > 0 ? 'income' : 'expense');
    item.innerHTML = `
      <span>${txn.description}</span>
      <span>₹${txn.amount}</span>
      <button onclick="editTransaction(${txn.id})">✏️</button>
      <button onclick="deleteTransaction(${txn.id})">❌</button>
    `;
    list.appendChild(item);
  });

console.log("All Transactions:", transactions);

const income = transactions
  .filter(t => t.amount > 0)
  .reduce((acc, txn) => acc + txn.amount, 0);

const expense = transactions
  .filter(t => t.amount < 0)
  .reduce((acc, txn) => acc + txn.amount, 0);

console.log("Income:", income);
console.log("Expense:", expense);

totalIncome.textContent = income.toFixed(2);
totalExpense.textContent = Math.abs(expense).toFixed(2);
balance.textContent = (income + expense).toFixed(2);

}

function editTransaction(id) {
  const txn = transactions.find(t => t.id === id);
  descInput.value = txn.description;
  amountInput.value = txn.amount;
  editId = id;
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateStorage();
  renderTransactions();
}

function updateStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

renderTransactions();


