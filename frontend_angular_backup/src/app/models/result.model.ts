export interface Result {
  _id?: string;
  userId?: string;
  quizId: any; // Populated quiz object
  answers: number[];
  score: number;
  totalQuestions: number;
  submittedAt?: string;
}
