const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// Funções principais
function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  if (operation != null) {
    previousOperandElement.textContent = `${previousOperand} ${operation}`;
  } else {
    previousOperandElement.textContent = '';
  }
}

function appendNumber(number) {
  if (currentOperand === '0' || shouldResetScreen) {
    currentOperand = number;
    shouldResetScreen = false;
  } else {
    currentOperand += number;
  }
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentOperand = '0.';
    shouldResetScreen = false;
    return;
  }
  if (currentOperand.includes('.')) return;
  currentOperand += '.';
}

function chooseOperation(op) {
  if (currentOperand === '') return;
  if (previousOperand !== '') {
    compute();
  }
  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
}

function compute() {
  let result;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '−':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      result = prev / current;
      break;
    default:
      return;
  }

  currentOperand = result.toString();
  operation = undefined;
  previousOperand = '';
  shouldResetScreen = true;
}

function clear() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
}

function deleteNumber() {
  if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
}

// Event Listeners
document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    appendNumber(button.textContent);
    updateDisplay();
  });
});

document.querySelectorAll('[data-action="operator"]').forEach(button => {
  button.addEventListener('click', () => {
    chooseOperation(button.dataset.operator);
    updateDisplay();
  });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
  compute();
  updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
  clear();
  updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
  deleteNumber();
  updateDisplay();
});

document.querySelector('[data-action="decimal"]').addEventListener('click', () => {
  appendDecimal();
  updateDisplay();
});

// Suporte a teclado (opcional, mas muito legal)
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendDecimal();
  if (e.key === '=' || e.key === 'Enter') compute();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clear();
  if (e.key === '+') chooseOperation('+');
  if (e.key === '-') chooseOperation('−');
  if (e.key === '*') chooseOperation('×');
  if (e.key === '/') chooseOperation('÷');
  updateDisplay();
});