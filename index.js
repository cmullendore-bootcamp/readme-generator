// TODO: Include packages needed for this application
const fs = require("fs");
const inquirer = require("inquirer");

function populateLicenses(questions) {
    fetch("https://api.github.com/licenses")
        .then(response => {
            if (!response.ok) {
                throw "Licenses service unavailable";
            }

            var json = response.json()
                .then(licenses => {
                    questions.forEach(element => {
                        if (element.name === 'license') {
                            choices = [];
                            licenses.forEach(l => {
                                choices.push(l.name);
                            });
                            element.choices = choices;
                        };
                    });

                    askQuestions(questions, licenses);
                });
        });

}

function askQuestions(questions, licenses) {
    inquirer.prompt(questions)
        .then(answers => {

            licenses.forEach(lic => {
                if (answers.license == lic.name) {
                    answers.license = lic;
                }
            });

            writeToFile("README.md", answers);
        });
}

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
Licensed under the ${data.license.name} available at ${data.license.url}
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

    populateLicenses(questions);

}

// Function call to initialize app
init();