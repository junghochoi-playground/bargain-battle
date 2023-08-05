import { Link } from 'react-router-dom'

const Landing = () => {
	return (
		<div>
			<p className="text-3xl font-bold underline">
				This is the landing page
			</p>

			<Link to="start-game">Click here to go to /start-game</Link>
		</div>
	)
}

export default Landing
