let expression = "";
let seen = document.querySelector(".screen #seen");
let output = document.querySelector(".screen #output");
let submit = document.querySelector(".button#submit");
let units = document.querySelectorAll(".button.unit");
const clear = document.querySelector(".button#clear");
const percentage = document.querySelector(".button#percentage");
const sign = document.querySelector(".button#sign");


function updateExpression() {
    expression += this.textContent;
    seen.textContent = expression;
    output.textContent = evaluateExpression(expression);
}

function evaluateExpression(expr) {
    let sign = 1;
    if (["+", "-"].some(key => key === expr.at(0))) {
        sign = +(expr[0] + "1")
        expr = expr.substr(1);
    }
    let numbers = expr.match(/\d+(\.\d{1,5})?/g)
    numbers = numbers ? numbers.map(num => +num) : [];
    const operators = expr.match(/[\/+\*-]{1}/g);
    if (expr.length === 0) return "";
    if (numbers.length === 1) return numbers[0] * sign;
    if (operators.length + 1 !== numbers.length) return "";
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
    let safeKeys = ["+", "-", "*", "/", "."];
    for (let i=0; i<=9; i++) safeKeys.push(i.toString());
    if (safeKeys.some(key => key === event.key)) {
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

function clearScreen() {
    expression = "";
    seen.textContent = "";
    output.textContent = "";
}