import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Prism from "prismjs";

import { backendUrl } from "../../constants";
import Spinner from "../Spinner/Spinner";
import "./ProblemPage.scss";
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/components/prism-python.js";

const ProblemPage = ({ isUser }) => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const codeRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
    isUser &&
      !problem &&
      (async () => {
        const res = await fetch(`${backendUrl}/problem/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        });

        const { problem } = await res.json();
        problem && Prism.highlightAll();
        setProblem(problem);
        setSubmission(problem.base_code);
      })();
  }, [submission]);

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

  const handleCodeScroll = (e) => {
    codeRef.current.scrollTop = e.target.scrollTop;
    codeRef.current.scrollLeft = e.target.scrollLeft;
  };

  const handleCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const beforeTab = submission.slice(0, e.target.selectionStart);
      const afterTab = submission.slice(
        e.target.selectionEnd,
        submission.length,
      );
      setSubmission(beforeTab + "\t" + afterTab);
    }
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
        <div className="code-area">
          <h1>Code Here</h1>
          <div className="input-container">
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              spellCheck={false}
              onScroll={handleCodeScroll}
              onKeyDown={handleCodeKeyDown}
            />
            <pre aria-hidden={true} ref={codeRef}>
              <code className="language-python">{submission}</code>
            </pre>
          </div>
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
