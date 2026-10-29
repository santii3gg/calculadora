const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  
  if (operation != null) {
    const symbol = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    }[operation];
    previousOperandElement.textContent = `${previousOperand} ${symbol}`;
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
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentOperand = '0.';
    shouldResetScreen = false;
    updateDisplay();
    return;
  }
  if (currentOperand.includes('.')) return;
  currentOperand += '.';
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === '') return;
  
  if (previousOperand !== '') {
    compute();
  }
  
  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function compute() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  let result;
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = prev / current;
      break;
    default:
      return;
  }

  // Evita números muito longos
  currentOperand = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
  operation = undefined;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteNumber() {
  if (shouldResetScreen) return;
  
  if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}

// Botões de número
document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    appendNumber(button.textContent);
  });
});

// Operadores
document.querySelectorAll('[data-action="operator"]').forEach(button => {
  button.addEventListener('click', () => {
    chooseOperation(button.dataset.operator);
  });
});

// Igual
document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
  compute();
});

// Limpar
document.querySelector('[data-action="clear"]').addEventListener('click', () => {
  clearAll();
});

// Apagar
document.querySelector('[data-action="delete"]').addEventListener('click', () => {
  deleteNumber();
});

// Ponto decimal
document.querySelector('[data-action="decimal"]').addEventListener('click', () => {
  appendDecimal();
});

// Teclado
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendDecimal();
  if (e.key === '=' || e.key === 'Enter') compute();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clearAll();
  if (e.key === '+') chooseOperation('+');
  if (e.key === '-') chooseOperation('-');
  if (e.key === '*') chooseOperation('*');
  if (e.key === '/') chooseOperation('/');
});
