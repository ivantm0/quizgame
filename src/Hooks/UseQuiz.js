import { useState } from "react";

const useQuiz = () => {
  const [quizData, setQuizData] = useState([]);

  const fetchQuizData = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const formatted = data.results.map((q) => ({
        question: q.question,
        options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
        answer: q.correct_answer,
      }));
      setQuizData(formatted);
    } catch (err) {
      console.log("Failed to fetch quiz data", err);
    }
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  return { quizData, fetchQuizData };
};

export default useQuiz;
