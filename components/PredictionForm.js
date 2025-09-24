// Example fetch from React component
const handlePredict = async () => {
  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: { crop: "rice", area: 2, rainfall: 800 } })
    });
    const data = await response.json();
    console.log("Prediction:", data);
  } catch (error) {
    console.error("Prediction API error:", error);
  }
};