let expression = "";
let seen = document.querySelector(".screen #seen");
let output = document.querySelector(".screen #output");
let submit = document.querySelector(".button#submit");
let units = document.querySelectorAll(".button.unit");


function updateExpression() {
    expression += this.textContent;
    seen.textContent = expression;
    output.textContent = evaluateExpression(expression);
}

function evaluateExpression(expr) {
    const numbers = expr.match(/\d+(\.\d{1,5})?/g).map(num => +num);
    const operators = expr.match(/[\+-\/\*]{1}/g);
    if (expr.length === 0) return "";
    if (numbers.length === 1) return +numbers[0];
    if (+operators.length + 1 !== +numbers.length) return "";
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
        (ans, operation) => opMap[operation.operator](ans, operation.number),
        numbers[0]
    );
    return (Math.round(answer*1e5)/1e5).toString();
}

function keyOperate(event) {
    if (event.keyCode === 8) {
        expression = expression.substr(0, expression.length-1);
        return;
    }
    if (event.keyCode === 13) {
        seen.textContent = "";
        return;
    }
    let safeKeys = ["+", "-", "*", "/"];
    for (let i=0; i<=9; i++) safeKeys.push(i.toString());
    if (safeKeys.some(key => key === event.key)) {
        expression += event.key;
        seen.textContent = expression;
        output.textContent = evaluateExpression(expression);
        return;
    }
}