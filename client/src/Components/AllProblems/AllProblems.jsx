import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { backendUrl } from '../../constants'
import './AllProblems.scss'

const AllProblems = () => {
  const [problems, setProblems] = useState(null);
  
  useEffect(() => {
    (async function () {
      const res = await fetch(`${backendUrl}/problems`);
      const data = await res.json();
      setProblems(data);
    })();
  }, []);

  return (
    <div className='all-problems-container'>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Acceptance</th>
          </tr>
        </thead>
        <tbody>
          {
            problems?.map(problem => {
              return(
                <tr key={problem.id}>
                  <td><Link to={`/problem/${problem.id}`}>{problem.title}</Link></td>
                  <td className={problem.difficulty}>{problem.difficulty[0].toUpperCase() + problem.difficulty.substring(1)}</td>
                  <td>{problem.acceptance}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default AllProblems
