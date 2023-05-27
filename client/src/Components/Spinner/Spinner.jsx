import SpinnerSVG from '../../assets/spinner.svg'
import './Spinner.scss'

const Spinner = ({ size = '40px' }) => {
  return (
    <img className='spinner' width={size + 'px'} height={size + 'px'} src={SpinnerSVG} alt='Loading...' />
  )
}

export default Spinner
