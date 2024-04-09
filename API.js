document.getElementById('api-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const queryInput = document.getElementById('query-input');
    const responseDiv = document.getElementById('response');

    responseDiv.innerHTML = ''; // Clear the response div

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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' // Ensure to replace with your actual API key securely
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                {role: "system", content: "Vous êtes un assistant serviable."},
                {role: "user", content: queryInput.value}
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        if (data.choices && data.choices.length > 0) {
            console.log("Detailed log of choice[0]:", data.choices[0]);
            let responses = data.choices.map(choice => {
                // Assuming 'message' object is always present based on the API response structure you've shown
                return `<p>${choice.message.content.trim()}</p>`;
            }).join('');
            responseDiv.innerHTML = responses;
        } else {
            console.log("La réponse ne contient pas de 'proposition valable' ou est vide.");
            responseDiv.innerHTML = "<p>No response generated or the response format is incorrect.</p>";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        responseDiv.innerHTML = "<p>An error occurred while fetching the response.</p>";
    });
});
