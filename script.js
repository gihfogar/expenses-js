const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const imputTransactionName = document.querySelector("#text");
const imputTransactionAmount = document.querySelector("#amount");

const localStorageTransaction = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransaction : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  updateLocalStorage();

  init();
};

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `${name}
    <span>${operator} € ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick ="removeTransaction(${id})">
    x
    </button>`;
  transactionsUl.append(li);
};

const getExpenses = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  const total = getTotal(transactionsAmounts);

  const income = getIncome(transactionsAmounts);

  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `€ ${total}`;
  incomeDisplay.textContent = `€ ${income}`;
  expenseDisplay.textContent = `€ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => [
  localStorage.setItem("transactions", JSON.stringify(transactions)),
];

const generateID = () => Math.round(Math.random() * 1000);

const addTransactionArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const cleanImputs = () => {
  imputTransactionName.value = "";
  imputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = imputTransactionName.value.trim();
  const transactionAmount = imputTransactionAmount.value.trim();
  const isSomeImputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeImputEmpty) {
    alert("Por favor, preencha todos os campos em falta!");
    return;
  }

  addTransactionArray(transactionName, transactionAmount);
  init();
  updateLocalStorage();
  cleanImputs;
};

form.addEventListener("submit", handleFormSubmit);
