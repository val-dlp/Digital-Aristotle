document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the submit button
    document.getElementById('submit-btn').addEventListener('click', submitForm);
});

async function submitForm() {
    // Get form values
    const system_prompt = document.getElementById('prompt').value;
    const user_message = document.getElementById('message').value;
    
    // Validate required fields
    if (!system_prompt || !user_message) {
        showResult('Please fill in all required fields (prompt and message)', true);
        return;
    }
    
    // Prepare data
    const data = {
        system_prompt: system_prompt,
        user_message: user_message,
    };
    
    try {
        //console.log(data)
        // Send POST request to API
        const response = await fetch('http://localhost:8000/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Parse response
        const result = await response.json();
        
        // Check if request was successful
        if (response.ok) {
            showResult(JSON.stringify(result, null, 2), false);
        } else {
            showResult(`Error: ${JSON.stringify(result, null, 2)}`, true);
        }
    } catch (error) {
        showResult(`Network Error: ${error.message}. Make sure your API server is running.`, true);
    }
}

function showResult(content, isError) {
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('result-content');
    
    resultContent.textContent = content;
    
    if (isError) {
        resultDiv.classList.add('error');
    } else {
        resultDiv.classList.remove('error');
    }
    
    resultDiv.style.display = 'block';
}