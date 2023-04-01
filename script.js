let expression = "";
let seen = document.querySelector(".screen #seen");
let output = document.querySelector(".screen #output");
let submit = document.querySelector(".button#submit");
let units = document.querySelectorAll(".button.unit");
const clear = document.querySelector(".button#clear");
const percentage = document.querySelector(".button#percentage");
const sign = document.querySelector(".button#sign");
const round = document.querySelector(".button#round");
let decimal = document.querySelector(".button#decimal");


function updateExpression() {
    expression += this.textContent;
    seen.textContent = expression;
    if (this.textContent === ".") {
        decimal.removeEventListener("click", updateExpression);
    }
    if ("+-/*".includes(this.textContent)) {
        decimal.addEventListener("click", updateExpression);
    }
    const textOutput = evaluateExpression(expression);
    if (textOutput === "Zero Division Error") {
        output.classList.add("zero-division-error");
        setTimeout(() => {
            output.classList.remove("zero-division-error");
            clearScreen()
        }, 5000)
    }
    output.textContent = textOutput;
}

function evaluateExpression(expr) {
    let sign = 1;
    if ("+-".includes(expr.charAt(0))) {
        sign = +(expr[0] + "1")
        expr = expr.substr(1);
    }
    let numbers = expr.match(/\d+(\.\d{1,20})?/g)
    numbers = numbers ? numbers.map(num => +num) : [];
    const operators = expr.match(/[\/+\*-]/g);
    if (expr.length === 0) return "";
    if (numbers.length === 1) return numbers[0] * sign;
    if (!numbers && !operators && operators.length + 1 !== numbers.length) return "";
    numbers[0] *= sign;
    const operations = numbers.slice(1).map((num, i) => {
        return {
            number: num,
            operator: operators[i]
        }
    });
    const opMap = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    }
    const answer = operations.reduce(
        (ans, op) => opMap[op.operator](ans, op.number),
        numbers[0]
    );
    if (answer == Infinity) return "Zero Division Error";
    return (Math.round(answer*1e5)/1e5).toString();
}

function keyOperate(event) {
    if (event.keyCode === 8) {
        expression = expression.substr(0, expression.length-1);
        seen.textContent = expression;
        output.textContent = evaluateExpression(expression);
        return;
    }
    if (event.keyCode === 13) {
        seen.textContent = "";
        output.textContent = evaluateExpression(expression);
        expression = output.textContent;
        return;
    }
    let safeKeys = "+-/*0123456789";
    if (safeKeys.includes(event.key)) {
        expression += event.key;
        seen.textContent = expression;
        output.textContent = evaluateExpression(expression);
        return;
    }
}

function evaluateEquals() {
    seen.textContent = "";
    output.textContent = evaluateExpression(expression);
    expression = output.textContent;
}

function evaluatePercentage() {
    if (seen.textContent.length > 0) return;
    expression = (+expression / 100).toString();
    output.textContent = expression;
}

function changeSign() {
    if (seen.textContent.length > 0) return;
    expression = (-expression).toString();
    output.textContent = expression;
}

function roundingOff() {
    if (seen.textContent.length > 0) return;
    expression = (Math.round(expression)).toString();
    output.textContent = expression;
}

function clearScreen() {
    expression = "";
    seen.textContent = "";
    output.textContent = "";
}