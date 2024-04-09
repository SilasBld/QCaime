document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const queryInput = document.getElementById('query-input');
    const responseDiv = document.getElementById('response');

    responseDiv.innerHTML = ''; // Clear the response div

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer met_la_clé_là_et_garde_bearer' // Ensure to replace with your actual API key securely
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
            // Utiliser 'Hoo-hoooo !' comme séparateur basé sur votre dernier exemple
            const questions = fullResponse.split('Hoo-hoooo !').filter(question => question.trim() !== '');
    
            let htmlContent = '';
            questions.forEach((questionText, index) => {
                // Remplacer directement les sauts de ligne dans le texte complet par <br> avant de séparer les questions
                const formattedQuestionText = questionText.replace(/\n/g, '<br>');
    
                // Ajouter la question formatée dans un div
                htmlContent += `<div class="question">${formattedQuestionText}</div>`;
    
                // Ajouter un bouton après chaque question
                htmlContent += `<button type="button" id="question-btn-${index}">Valider la question</button>`;
    
                // Ajouter un double saut de ligne pour espacer les questions
                htmlContent += '<br><br>';
            });
    
            responseDiv.innerHTML = htmlContent;
        } else {
            responseDiv.innerHTML = "<p>No response generated or the response format is incorrect.</p>";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        responseDiv.innerHTML = "<p>An error occurred while fetching the response.</p>";
    });
    
    
    
});