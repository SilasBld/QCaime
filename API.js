document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const queryInput = document.getElementById('query-input');
    const responseDiv = document.getElementById('response');

    //  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

    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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' // Replace 'Your_API_Key' with your actual API key
        },
        body: JSON.stringify({
            model: 'text-davinci-003', // Adjust the model as needed
            prompt: queryInput.value,
            temperature: 0.7,
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Pour le débogage, affiche toute la réponse
    
        // Vérifie si 'choices' existe et contient au moins un élément
        if (data.choices && data.choices.length > 0) {
            // Si oui, affiche le texte de la première réponse
            responseDiv.innerHTML = `<p>${data.choices[0].text.trim()}</p>`;
        } else {
            // Si non, affiche un message indiquant que la réponse est vide ou incorrecte
            console.log("La réponse ne contient pas de 'choices' ou est vide.");
            responseDiv.innerHTML = `<p>No response generated or the response format is incorrect.</p>`;
        }
    })
    .catch(error => {
        console.error('Error making request:', error);
        // Affiche un message d'erreur général si la requête échoue pour une autre raison
        responseDiv.innerHTML = `<p>Error making request: ${error.message}</p>`;
    });
});
