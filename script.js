const input = document.querySelector("input");
const buttons = document.querySelectorAll("button");
const dotButton = [...buttons].find((btn) => btn.textContent === ".");

let firstNumber = null;
let op = null;
let freshResult = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(op, num1, num2) {
  switch (op) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
  }
}

function clean(num) {
  return parseFloat(num.toPrecision(12));
}

function updateVar(val) {
  input.value = val;
}

function clr() {
  input.value = "";
  firstNumber = null;
  op = null;
  freshResult = false;
}

function showError() {
  updateVar("Error");
  firstNumber = null;
  op = null;
  freshResult = true;
}

function isOperator(key) {
  return key === "+" || key === "-" || key === "*" || key === "/";
}

function currentSegment() {
  const parts = input.value.split(/[+\-*/]/);
  return parts[parts.length - 1];
}

function secondNumber() {
  const seg = currentSegment();
  return seg === "" ? null : Number(seg);
}

function syncFromDisplay() {
  const opMatch = input.value.match(/[+\-*/]/);
  if (opMatch) {
    firstNumber = Number(input.value.split(/[+\-*/]/)[0]);
    op = opMatch[0];
  } else {
    firstNumber = null;
    op = null;
  }
}

function refreshDot() {
  dotButton.disabled = currentSegment().includes(".");
}

function handleKey(key) {
  if (input.value === "Error" && key !== "C") clr();

  if (key === "C") {
    clr();
    refreshDot();
    return;
  }

  if (key === "←") {
    updateVar(input.value.slice(0, -1));
    freshResult = false;
    syncFromDisplay();
    refreshDot();
    return;
  }

  if (key === "=") {
    const second = secondNumber();

    if (firstNumber !== null && op !== null && second !== "") {
      const result = clean(operate(op, firstNumber, second));
      if (!Number.isFinite(result)) {
        showError();
        refreshDot();
        return;
      }
      updateVar(String(result));
      firstNumber = null;
      op = null;
      freshResult = true;
    }
    refreshDot();
    return;
  }
  if (isOperator(key)) {
    if (input.value === "") {
      refreshDot();
      return;
    }

    if (freshResult) {
      firstNumber = Number(input.value);
      op = key;
      updateVar(input.value + key);
      freshResult = false;
      refreshDot();
      return;
    }

    if (firstNumber !== null && op !== null) {
      const second = secondNumber();

      if (second !== null) {
        const result = clean(operate(op, firstNumber, second));
        if (!Number.isFinite(result)) {
          showError();
          refreshDot();
          return;
        }
        firstNumber = result;
        updateVar(result + key);
      } else {
        updateVar(input.value.slice(0, -1) + key);
      }
      op = key;
    } else {
      firstNumber = Number(input.value);
      op = key;
      updateVar(input.value + key);
    }
    refreshDot();
    return;
  }

  if (key === ".") {
    if (freshResult) {
      updateVar("0");
      freshResult = false;
    } else if (currentSegment() === "") {
      updateVar(input.value + "0.");
    } else if (!currentSegment().includes(".")) {
      updateVar(input.value + ".");
    }
    refreshDot();
    return;
  }

  if (freshResult) {
    updateVar(key);
    freshResult = false;
  } else {
    updateVar(input.value + key);
  }
  refreshDot();
}

buttons.forEach((btn) =>
  btn.addEventListener("click", (e) => handleKey(e.target.textContent)),
);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const k = event.key;
  let mapped = null;

  if (/^[0-9]$/.test(k)) mapped = k;
  else if (k === ".") mapped = ".";
  else if (isOperator(k)) mapped = k;
  else if (k === "Enter" || k === "=") mapped = "=";
  else if (k === "Backspace") mapped = "←";
  else if (k === "Escape") mapped = "C";

  if (mapped !== null) {
    event.preventDefault();
    handleKey(mapped);
  }
});
