export interface Question {
  _id?: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer?: number;
}
