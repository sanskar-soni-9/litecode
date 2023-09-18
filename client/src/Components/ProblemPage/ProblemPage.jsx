import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../constants";
import Spinner from "../Spinner/Spinner";
import "./ProblemPage.scss";

const ProblemPage = ({ isUser }) => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    isUser &&
      (async () => {
        const res = await fetch(`${backendUrl}/problem/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        });

        const { problem } = await res.json();
        setProblem(problem);
        setSubmission(problem.base_code);
      })();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await fetch(`${backendUrl}/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ problemID: problem.id, submission }),
    });
    const data = await res.json();
    setIsCorrect(data.status === "AC" ? true : false);
    setResult(data.response);
    setIsSubmitting(false);
  };

  if (!isUser)
    return (
      <div className="problemPage-container">
        <div className="message-container">
          <h1>Please Login to view the problem</h1>
        </div>
      </div>
    );

  return problem ? (
    <div className="problemPage-container">
      <div className="problem-input-wrapper">
        <div className="problem-container">
          <h1>{problem?.title}</h1>
          <h2>Description</h2>
          <h4>{problem?.description}</h4>
          <p>Input : {problem.examplein}</p>
          <p>Output : {problem.exampleout}</p>
        </div>
        <div className="input-container">
          <h1>Code Here</h1>
          <textarea
            style={{ width: "100%", height: "75%" }}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
          <div className={`result-container ${isCorrect && "correct"}`}>
            {isSubmitting ? (
              <div className="submitting-spinner-container">
                <Spinner size="40" />
              </div>
            ) : (
              <div className="result">{result}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="loading-spinner-container">
      <Spinner size="40" />
    </div>
  );
};

export default ProblemPage;
