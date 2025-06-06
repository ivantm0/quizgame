import "./App.css";
import Nav from "./Components/Nav/Nav";
import Index from "./Components/Pages";
import useQuiz from "./Hooks/UseQuiz";

function App() {
  const { quizData, fetchQuizData } = useQuiz();

  return (
    <>
      <Nav onGenerate={fetchQuizData} />
      <Index quizData={quizData} />
    </>
  );
}

export default App;
