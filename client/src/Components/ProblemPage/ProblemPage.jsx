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
  const [submission, setSubmission] = useState({
    value: "",
    caret: -1,
    target: null,
  });
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const codeRef = useRef(null);

  const tabSize = 2;

  useEffect(() => {
    Prism.highlightAll();
    if (submission.caret >= 0 && submission.target) {
      submission.target.setSelectionRange(
        submission.caret,
        submission.caret
      );
    }
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
        setSubmission({ ...submission, value: problem.base_code });
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
      body: JSON.stringify({
        problemID: problem.id,
        submission: submission.value,
      }),
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

      const caret = e.target.selectionStart;
      const newValue =
        e.target.value.substring(0, caret) +
        " ".repeat(tabSize) +
        e.target.value.substring(caret);

      setSubmission({ value: newValue, caret: caret + tabSize, target: e.target });
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
          <div className="note">
            <span>Note: </span>
            The Execution server is currently hosted on Azure Kubernetes
            Service. Due to the high cost of running the cluster, the server
            will be shut down after some days.
            <p>
              <span>Execution Server Status: Inactive</span>
            </p>
          </div>
          <h2>Description</h2>
          <h4>{problem?.description}</h4>
          <p>Input : {problem.examplein}</p>
          <p>Output : {problem.exampleout}</p>
          <p className="note">
            <span>Note: </span>Since its a dummy project the code submission
            doesn't validates code with multiple test cases but picks up a
            random test case and check with its output.
          </p>
        </div>
        <div className="code-area">
          <h1>Write Your Python Code Here:</h1>
          <div className="input-container">
            <textarea
              value={submission.value}
              onChange={(e) =>
                setSubmission({ ...submission, value: e.target.value, caret: e.target.selectionStart })
              }
              spellCheck={false}
              onScroll={handleCodeScroll}
              onKeyDown={handleCodeKeyDown}
              autoFocus
            />
            <pre aria-hidden ref={codeRef}>
              <code className="language-python">{submission.value}</code>
            </pre>
          </div>
          <button disabled={isSubmitting} onClick={handleSubmit}>
            Submit
          </button>
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
