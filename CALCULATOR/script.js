const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator-button');
let currentInput = '0';
let lastInputWasEquals = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function handleButtonClick(event) {
  const value = event.target.dataset.value;

  if (value === 'C') {
    currentInput = '0';
    lastInputWasEquals = false;
  } else if (value === 'backspace') {
    if (currentInput.length > 1 && currentInput !== 'Error') {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    lastInputWasEquals = false;
  } else if (value === '=') {
    try {
      let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
      expression = expression.replace(/([+\-*/.]{2,})/g, (match) => match[match.length - 1]);
      let result = eval(expression);
      if (result % 1 !== 0) result = parseFloat(result.toFixed(10));
      currentInput = result.toString();
      lastInputWasEquals = true;
    } catch {
      currentInput = 'Error';
      lastInputWasEquals = true;
    }
  } else if (['+', '-', '*', '/'].includes(value)) {
    lastInputWasEquals = false;
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/', '.'].includes(lastChar)) {
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }
  } else if (value === '.') {
    lastInputWasEquals = false;
    const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
    if (!lastNumber.includes('.')) currentInput += value;
  } else {
    if (currentInput === '0' || lastInputWasEquals) {
      currentInput = value;
      lastInputWasEquals = false;
    } else {
      currentInput += value;
    }
  }
  updateDisplay();
}

buttons.forEach(button => button.addEventListener('click', handleButtonClick));

document.addEventListener('keydown', (event) => {
  const key = event.key;
  let mappedValue = '';
  if (/[0-9]/.test(key)) mappedValue = key;
  else if (['+', '-', '*', '/'].includes(key)) mappedValue = key;
  else if (key === '.') mappedValue = '.';
  else if (key === 'Enter') mappedValue = '=';
  else if (key === 'Escape' || key.toLowerCase() === 'c') mappedValue = 'C';
  else if (key === 'Backspace') {
    if (currentInput.length > 1 && currentInput !== 'Error') currentInput = currentInput.slice(0, -1);
    else currentInput = '0';
    updateDisplay();
    return;
  }

  if (mappedValue) {
    const syntheticEvent = { target: { dataset: { value: mappedValue } } };
    handleButtonClick(syntheticEvent);
  }
});

updateDisplay();
