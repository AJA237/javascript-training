function advancedCalculator(expression: string): number | string {
    // Handle invalid input
    if (expression.length < 3) {
        console.error("Invalid input: Expression must have at least 3 characters.");
        return "Invalid input";
    }

    // Define operators and their precedence
    const arithmeticOperators: { [key: string]: (operand1: number, operand2: number) => number } = {
        '+': (operand1, operand2) => operand1 + operand2,
        '-': (operand1, operand2) => operand1 - operand2,
        '*': (operand1, operand2) => operand1 * operand2,
        '/': (operand1, operand2) => operand1 / operand2,
    };
    const operatorPrecedence: { [key: string]: number } = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    // Parse the expression into a token array
    const expressionTokens: string[] = [];
    let currentNumberToken: string = '';
    for (const character of expression) {
        if (character in arithmeticOperators) {
            expressionTokens.push(currentNumberToken, character);
            currentNumberToken = '';
        } else if (character >= '0' && character <= '9') {
            currentNumberToken += character;
        } else {
            console.error("Invalid character: " + character);
            return "Invalid input";
        }
    }
    if (currentNumberToken !== '') {
        expressionTokens.push(currentNumberToken);
    }

    // Implement the shunting-yard algorithm
    const postfixExpressionQueue: (number | string)[] = [];
    const operatorStack: string[] = [];
    for (const token of expressionTokens) {
        if (!isNaN(Number(token))) {
            postfixExpressionQueue.push(parseFloat(token));
        } else if (token in arithmeticOperators) {
            while (operatorStack.length > 0 &&
                   operatorPrecedence[operatorStack[operatorStack.length - 1]] >= operatorPrecedence[token]) {
                postfixExpressionQueue.push(operatorStack.pop() as string);
            }
            operatorStack.push(token);
        } else {
            console.error("Invalid token: " + token);
            return "Invalid input";
        }
    }
    while (operatorStack.length > 0) {
        postfixExpressionQueue.push(operatorStack.pop() as string);
    }

    // Evaluate the postfix expression
    const evaluationStack: number[] = [];
    for (const token of postfixExpressionQueue) {
        if (typeof token === 'number') {
            evaluationStack.push(token);
        } else if (token in arithmeticOperators) {
            const operand2 = evaluationStack.pop();
            const operand1 = evaluationStack.pop();
            if (operand1 === undefined || operand2 === undefined) {
                console.error("Invalid operation: Not enough operands.");
                return "Invalid input";
            }
            evaluationStack.push(arithmeticOperators[token](operand1, operand2));
        } else {
            console.error("Invalid token: " + token);
            return "Invalid input";
        }
    }

    // Return the result
    if (evaluationStack.length === 1) {
        return evaluationStack[0];
    } else {
        console.error("Unexpected result: Evaluation stack should contain only one element.");
        return "Invalid input";
    }
}

console.log(advancedCalculator("1+2*3/4"));