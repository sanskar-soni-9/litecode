import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl } from "../../constants";
import "./AllProblems.scss";
import Spinner from "../Spinner/Spinner";

const AllProblems = () => {
  const [problems, setProblems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(`${backendUrl}/problems`);
        const data = await res.json();
        data && setIsLoading(false);
        setProblems(data);
      } catch (err) {
        setIsLoading(false);
        setError(err.msg);
      }
    })();
  }, []);

  return !isLoading ? (
    <div className="all-problems-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
          </tr>
        </thead>
        <tbody>
          {problems?.map((problem) => {
            return (
              <tr key={problem.id}>
                <td>
                  <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
                </td>
                <td className={problem.difficulty}>
                  {problem.difficulty[0].toUpperCase() +
                    problem.difficulty.substring(1)}
                </td>
                <td>{problem.acceptance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="spinner-container">
      <Spinner size="40" />
    </div>
  );
};

export default AllProblems;
