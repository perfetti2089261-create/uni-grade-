'use client';

interface Prediction {
  id: string;
  predicted_grade: number;
  confidence_score: number;
  calculation_date: string;
  exams?: {
    name: string;
  };
}

interface PredictionListProps {
  predictions: Prediction[];
}

export const PredictionList: React.FC<PredictionListProps> = ({ predictions }) => {
  return (
    <div className="prediction-list">
      {predictions.length === 0 ? (
        <p className="empty-state">No predictions yet. Add some grades to get started!</p>
      ) : (
        <ul>
          {predictions.map((prediction) => (
            <li key={prediction.id} className="prediction-card">
              <div className="prediction-header">
                <h3>{prediction.exams?.name || 'General Prediction'}</h3>
                <span className="confidence">
                  {(prediction.confidence_score * 100).toFixed(0)}% confidence
                </span>
              </div>
              <div className="prediction-grade">
                <strong>Predicted Grade:</strong>
                <span className="grade-value">{prediction.predicted_grade.toFixed(2)}</span>
              </div>
              <div className="prediction-date">
                {new Date(prediction.calculation_date).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
