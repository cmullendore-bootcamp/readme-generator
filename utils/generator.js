//const fs = require("fs");
//const inquirer = require("inquirer");
import { readFileSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';


export function generate(questions_file) {

    // TODO: Create an array of questions for user input
    // NOTE: The array of questions is in the questions.json file
    // and is read in dynamically. This is a more maintainable model
    // than hard-coding the questions in the javascript.
    var qText = readFileSync(questions_file);

    var questions = JSON.parse(qText);

    fetch("https://api.github.com/licenses")
        .then(response => {
            if (!response.ok) {
                askQuestions(questions, null);
                return;
            }

            var json = response.json()
                .then(licenses => {
                    questions.forEach(element => {
                        if (element.name === 'license') {
                            let choices = [];
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
    console.log();
    inquirer.prompt(questions)
        .then(answers => {
            licenses.forEach(lic => {
                if (answers.license == lic.name) {
                    getLicenseDetail(answers, lic);
                }
            });
        });
}

function getLicenseDetail(answers, license) {
    fetch(license.url)
        .then(response => {
            if (response.ok) {
                response.json()
                    .then(license => {
                        writeToFile("README.md", answers, license);
                    });
            }
        });
}

// TODO: Create a function to write README file
function writeToFile(fileName, answers, license) {

    var content = `
![${license.name}](https://img.shields.io/static/v1?label=license&message=${license.spdx_id}&color=blue)
# ${answers.title}

## Table of Contents
* [Project Description](#Description)
* [Project Installation](#Installation)
* [Project Usage](#Usage)
* [Contributing to this Project](#Contributing)
* [Project Tests](#Tests)
* [Project Questions](#Questions)
* [License](#License)


## Description
${answers.description}

## Installation
${answers.installation}

## Usage
${answers.usage}

## Contributing
${answers.contributing}

## Tests
${answers.testing}

## Questions
Feel free to contact me if you have questions about this project via email as below:
* Owner: ${answers.fullname}
* Email: ${answers.email}
* GitHub Profile: https://github.com/${answers.github}

## License
Licensed under the ${license.name} available at ${license.html_url}
    `;

    writeFileSync(fileName, content);

}