// TODO: Include packages needed for this application
const fs = require("fs");
const inquirer = require("inquirer");

// TODO: Create an array of questions for user input
// NOTE: The array of questions is in the questions.json file
// and is read in dynamically. This is a more maintainable model
// than hard-coding the questions in the javascript.





// TODO: Create a function to write README file
function writeToFile(fileName, data) {


    var content = `# ${data.title}

## Description
${data.description}

## Installation
${data.installation}

## Usage
${data.usage}

## Contributing
${data.contributing}

## Tests
${data.testing}

## License

    `;

    fs.writeFileSync(fileName, content);

}

// TODO: Create a function to initialize app
function init() {
    // TODO: Create an array of questions for user input
    // NOTE: The array of questions is in the questions.json file
    // and is read in dynamically. This is a more maintainable model
    // than hard-coding the questions in the javascript.
    var qText = fs.readFileSync("questions.json");

    var questions = JSON.parse(qText);

    inquirer.prompt(questions)
        .then(answers => {
            writeToFile("README.md", answers);
        })
}

// Function call to initialize app
init();