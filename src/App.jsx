import "./App.css";
import Nav from "./Components/Nav/Nav";
import Content from "./Components/Pages/Content.jsx";
import useQuiz from "./Hooks/UseQuiz";

function App() {
  const { quizData, fetchQuizData } = useQuiz();

  return (
    <>
      <Nav onGenerate={fetchQuizData} />
      <Content quizData={quizData} />
    </>
  );
}

export default App;
