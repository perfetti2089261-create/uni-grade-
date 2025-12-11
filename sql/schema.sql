-- Tabella per i corsi/esami
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  course_code VARCHAR(50),
  credits INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per i voti degli esami
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grade DECIMAL(5, 2) NOT NULL CHECK (grade >= 0 AND grade <= 30),
  date_taken TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per le previsioni
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  predicted_grade DECIMAL(5, 2),
  confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indici per le performance
CREATE INDEX idx_exams_user_id ON exams(user_id);
CREATE INDEX idx_grades_exam_id ON grades(exam_id);
CREATE INDEX idx_grades_user_id ON grades(user_id);
CREATE INDEX idx_grades_date ON grades(date_taken);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_exam_id ON predictions(exam_id);

-- RLS Policies
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exams"
  ON exams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create exams"
  ON exams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exams"
  ON exams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exams"
  ON exams FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own grades"
  ON grades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create grades"
  ON grades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grades"
  ON grades FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grades"
  ON grades FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create predictions"
  ON predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
