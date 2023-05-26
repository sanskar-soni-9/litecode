import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { backendUrl } from '../../constants'

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [submission, setSubmission] = useState('');

  useEffect(() => {
    (async function() {
      const res = await  fetch(`${backendUrl}/problems/${id}`);
      const { problem } = await res.json();
      setProblem(problem);
    })();
  }, [])

  const handleSubmit = async () => {
    const code = document.querySelector('textarea').value;
    const res = await fetch(`${backendUrl}/submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('token')
      },
      body: JSON.stringify({ problemID: problem.id, submission })
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <div className='problemPage-container'>
      {
        problem ? (
          <>
            <div className='problem-container'>
              <h1>{problem?.title}</h1>
              <h2>Description</h2>
              <h4>{problem?.description}</h4>
              <p>Input : {problem.examplein}</p>
              <p>Output : {problem.exampleout}</p>
            </div>
            <div className='input-container'>
              <h1>Code Here</h1>
              <textarea autoFocus value={submission} onChange={e => setSubmission(e.target.value)} />
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </>
        ) : ''
      }
    </div>
  )
}

export default ProblemPage
