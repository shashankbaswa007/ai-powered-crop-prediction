import { useState } from "react";

const PredictionForm = () => {
  const [crop, setCrop] = useState("rice");
  const [area, setArea] = useState(2);
  const [rainfall, setRainfall] = useState(800);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: { crop, area: Number(area), rainfall: Number(rainfall) },
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
      console.log("Prediction:", data);
    } catch (err) {
      console.error("Prediction API error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Crop Yield Prediction</h2>

      <input
        type="text"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="Crop name"
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Area (hectares)"
        className="w-full p-2 border rounded"
      />

      <input
        type="number"
        value={rainfall}
        onChange={(e) => setRainfall(e.target.value)}
        placeholder="Rainfall (mm)"
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Predicting..." : "Predict Yield"}
      </button>

      {prediction && (
        <div className="p-2 border rounded bg-gray-100">
          <strong>Predicted Yield:</strong> {prediction.yield || "N/A"}
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default PredictionForm;