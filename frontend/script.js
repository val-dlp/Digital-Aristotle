document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the submit button
    document.getElementById('submit-btn').addEventListener('click', submitForm);
});

async function submitForm() {
    // Get form values
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const tax = document.getElementById('tax').value ? parseFloat(document.getElementById('tax').value) : null;
    
    // Validate required fields
    if (!name || isNaN(price)) {
        showResult('Please fill in all required fields (name and price)', true);
        return;
    }
    
    // Prepare data
    const data = {
        name: name,
        price: price,
    };
    
    // Add optional fields if they have values
    if (description) data.description = description;
    if (tax !== null) data.tax = tax;
    
    try {
        //console.log(data)
        // Send POST request to API
        const response = await fetch('http://localhost:8000/items/', {
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