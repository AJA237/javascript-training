function questionSelection(filePath) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          if (Array.isArray(jsonData)) {
            const randomIndex = Math.floor(Math.random() * jsonData.length);
            resolve(jsonData[randomIndex]);
          } else if (typeof jsonData === "object") {
            resolve(jsonData);
          } else {
            reject(
              new Error("Invalid JSON format. Expected an array or object.")
            );
          }
        } catch (parseError) {
          reject(new Error("Error parsing JSON."));
        }
      }
    });
  });
}

const readline = require("readline");

// Create an interface for reading data from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get a valid number from the user
function getInput(promptMessage) {
  return new Promise((resolve) => {
    rl.question(promptMessage, (input) => {
      resolve(input);
    });
  });
}

const filePath = "./questions.json";

async function getQuestion() {
  let isRunning = true;
  let options = ["a", "b", "c", "d"];
  let alreadyAnswered = [];
  let score = 0;

  console.log("Welcome to the quiz app!");
  while (isRunning || alreadyAnswered.length < 10) {
    try {
      let question = await questionSelection(filePath);
      if (alreadyAnswered.includes(question.question)) {
        question = await questionSelection(filePath);
      } else {
        console.log(question.question);
        alreadyAnswered.push(question.question);
        console.log("Options:");
        for (let i = 0; i < question.options.length; i++) {
          console.log(`${options[i]}. ${question.options[i]}`);
        }
        const answer = await getInput("Enter your answer: ");
        if (answer.toLowerCase() === question.answer.toLowerCase()) {
          score++;
          console.log("Correct!");
        } else if (
          question.answer.toLowerCase() ===
          question.options[options.indexOf(answer.toLowerCase())].toLowerCase()
        ) {
          score++;
          console.log("Correct!");
        } else {
          console.log("Incorrect. The correct answer is:", question.answer);
        }
      }
      if (alreadyAnswered.length === 10) {
        console.log(`You scored ${score} out of 10.`);
        console.log("Thanks for playing!");
        isRunning = false;
      }
    } catch (err) {
      console.error(err);
      isRunning = false;
    }
  }
  rl.close();
}

getQuestion();
