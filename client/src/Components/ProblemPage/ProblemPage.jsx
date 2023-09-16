import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../../constants";
import Spinner from "../Spinner/Spinner";
import "./ProblemPage.scss";

const ProblemPage = ({ isUser }) => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");

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
        setIsLoading(false);
      })();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await fetch(`${backendUrl}/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ problemID: problem.id, submission }),
    });
    const data = await res.json();
    console.log(data);
    setResult(data.response);
    setIsLoading(false);
  };

  if (!isUser)
    return (
      <div className="problemPage-container">
        <div className="message-container">
          <h1>Please Login to view the problem</h1>
        </div>
      </div>
    );

  return !isLoading ? (
    <div className="problemPage-container">
      {problem ? (
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
              autoFocus
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            {result && <p className="result">{result}</p>}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div className="spinner-container">
      <Spinner size="40" />
    </div>
  );
};

export default ProblemPage;
