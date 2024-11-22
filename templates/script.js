document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the default form submission

    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    // Convert the image to base64 string
    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Image = reader.result.split(',')[1];  // Get the base64 string without metadata

        // Send the image to the Flask API for prediction
        fetch('https://dermamodel-c0c9bb7a23c6.herokuapp.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image })
        })
        .then(response => response.json())
        .then(data => {
            // Show the result
            const resultDiv = document.getElementById("result");
            const predictionLabel = document.getElementById("predictionLabel");
            const confidence = document.getElementById("confidence");

            if (data.predicted_label) {
                predictionLabel.textContent = `Predicted: ${data.predicted_label}`;
                confidence.textContent = `Confidence: ${data.confidence.toFixed(2)}`;
            } else {
                predictionLabel.textContent = "Error: " + (data.error || "Unknown error");
                confidence.textContent = "";
            }

            resultDiv.style.display = 'block';  // Display the result section
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during the prediction.');
        });
    };

    reader.readAsDataURL(file);  // Read the image file as base64
});
