// Function to fetch JSON data from the selected file
function fetchJSONFile(filename, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", filename, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == "200") {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

function processJSONData(data) {
    // Get the container element from the DOM where we will display the questions and answers
    const jsonQuestionsContainer = document.getElementById('jsonQuestionsContainer');

    // Check if the container element exists
    if (!jsonQuestionsContainer) {
        console.error("Container element not found.");
        return;
    }

    // Clear the container before adding the new questions and answers (optional, but prevents duplicates on re-run)
    jsonQuestionsContainer.innerHTML = '';

    // Loop through the array of objects and create a <div> for each question
    data.forEach(item => {
        const questionDiv = document.createElement('div');
        questionDiv.textContent = "Question: " + item.question;
        questionDiv.classList.add("question"); // Add a class for styling purposes

        // Check if the "answers" key exists in the current item
        if (item.hasOwnProperty('answers') && Array.isArray(item.answers)) {
            const answersList = document.createElement('ul');

            // Loop through the list of objects under "answers" and create list items for each key-value pair
            item.answers.forEach(answerObj => {
                const answerItem = document.createElement('li');
                const key = Object.keys(answerObj)[0];
                const value = answerObj[key];

                // Create separate elements for key and value to apply different styles
                const keyElement = document.createElement('span');
                const valueElement = document.createElement('span');

                // Apply different styles to the key and value
                keyElement.textContent = key + ": ";
                keyElement.classList.add("answer-key"); // Add a class for styling purposes

                valueElement.textContent = value;

                answerItem.appendChild(keyElement);
                answerItem.appendChild(valueElement);
                answersList.appendChild(answerItem);
            });

            questionDiv.appendChild(answersList);
        }

        if (item.hasOwnProperty('correct_answer')) {
            const correctAnswerDiv = document.createElement('div');
            correctAnswerDiv.textContent = "Correct Answer: ";

            const correctAnswerText = document.createElement('span');
            correctAnswerText.textContent = item.correct_answer;
            correctAnswerText.classList.add("correct-answer"); // Add the "correct-answer" class

            correctAnswerDiv.appendChild(correctAnswerText);
            questionDiv.appendChild(correctAnswerDiv);
        }

        jsonQuestionsContainer.appendChild(questionDiv);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const jsonFileSelect = document.getElementById('jsonFileSelect');

    // Fetch the list of available JSON files from the availableFiles.json file
    fetch('/availableFiles.json')
        .then(response => response.json())
        .then(availableFiles => {
            // Populate the select element with options for each JSON file
            availableFiles.forEach(filename => {
                const option = document.createElement('option');
                option.textContent = filename;
                jsonFileSelect.appendChild(option);
            });

            // Function to handle file selection change
            function handleFileSelection() {
                const selectedFilename = jsonFileSelect.value;
                fetchJSONFile(selectedFilename, processJSONData);
            }

            // Attach an event listener to the select element to handle changes
            jsonFileSelect.addEventListener('change', handleFileSelection);

            // Load and display the initial JSON data (from the first file in the list)
            const initialFile = availableFiles[0];
            fetchJSONFile(initialFile, processJSONData);
        })
        .catch(err => {
            console.error(err);
            alert('Failed to fetch availableFiles.json.');
        });
});
