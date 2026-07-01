const display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;

function updateDisplay() {
    display.textContent = currentInput;
}

function handleNumber(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator !== null) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    currentInput = '0';
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Button click handlers
document.querySelectorAll('.number').forEach(btn => {
    btn.addEventListener('click', function() {
        handleNumber(this.textContent);
    });
});

document.querySelectorAll('.operator').forEach(btn => {
    btn.addEventListener('click', function() {
        handleOperator(this.textContent);
    });
});

document.querySelector('.equals').addEventListener('click', calculate);
document.querySelector('.clear').addEventListener('click', clearAll);
document.querySelector('.delete').addEventListener('click', deleteLast);

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
    if (e.key === '.') handleNumber('.');
    if (e.key === '+') handleOperator('+');
    if (e.key === '-') handleOperator('-');
    if (e.key === '*') handleOperator('×');
    if (e.key === '/') handleOperator('/');
    if (e.key === 'Enter') calculate();
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Backspace') deleteLast();
});
