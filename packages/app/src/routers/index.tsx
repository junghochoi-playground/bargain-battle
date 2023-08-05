import { createBrowserRouter } from 'react-router-dom'

import { Landing, StartGame, Game, TailwindTest } from '../pages'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Landing />,
	},
	{
		path: '/start-game',
		element: <StartGame />,
	},
	{
		path: '/game/:id',
		element: <Game />,
	},
	{
		path: '/tailwind',
		element: <TailwindTest />,
	},
])

export default router
