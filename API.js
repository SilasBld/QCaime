document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const queryInput = document.getElementById('query-input');
    const responseDiv = document.getElementById('response');

    responseDiv.innerHTML = ''; // Clear the response div

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer clé_API_OpenAI' // Replace with your secure handling method
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                {role: "system", content: "Vous êtes un assistant serviable. Votre interlocuteur vous donnera : un thème, un niveau scolaire et un nombre X de questions à rédiger. Vous devez rédiger X questions à choix multiples (1 proposition juste, 3 fausses) sur le thème de la requête. La première proposition doit toujours contenir la bonne réponse. Vous finissez toutes vos réponses par 'Hoo-hoooo !'. Enfin, tu sautes une ligne à chaque question."},
                {role: "user", content: queryInput.value}
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const fullResponse = data.choices[0].message.content.trim();
            const questions = fullResponse.split('Hoo-hoooo !').filter(question => question.trim() !== '');

            let htmlContent = '';
            questions.forEach((questionText, index) => {
                const formattedQuestionText = questionText.replace(/\n/g, '<br>');

                htmlContent += `<div class="question">${formattedQuestionText}</div>`;
                htmlContent += `<button type="button" class="validate-question" data-index="${index}">Valider la question</button>`;
                htmlContent += '<br><br>';
            });

            responseDiv.innerHTML = htmlContent;

            document.querySelectorAll('.validate-question').forEach(button => {
                button.addEventListener('click', function() {
                    const questionIndex = this.getAttribute('data-index');
                    const questionText = document.querySelectorAll('.question')[questionIndex].innerText.replace(/<br>/g, '\n').split('\n').filter(line => line.trim() !== '');
                    const examName = document.getElementById('exam-name').value;

                    // Assurez-vous d'ajuster les indices si votre formatage inclut plus de lignes avant les réponses
                    const dataToSend = {
                        fields: {
                            "Question": questionText[0], // La question
                            "Réponse A": questionText[1], // La bonne réponse
                            "Réponse B": questionText[2],
                            "Réponse C": questionText[3],
                            "Réponse D": questionText[4],
                            "Intitulé Examen": examName
                        }
                    };

                    fetch('fetch_airtable', {                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer token_airtable',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        // Gérez ici la réponse de l'API, comme confirmer l'envoi ou afficher une erreur
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                });
            });
        } else {
            responseDiv.innerHTML = "<p>No response generated or the response format is incorrect.</p>";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        responseDiv.innerHTML = "<p>An error occurred while fetching the response.</p>";
    });
});
