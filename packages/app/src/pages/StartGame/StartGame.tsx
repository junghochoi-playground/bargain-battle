import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface RoomInfo {
	roomId: string
}

const StartGame = () => {
	const [username, setUsername] = useState<string>('')
	const navigate = useNavigate()

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}

	const handleStartGame = async () => {
		const data = {
			host: username,
		}

		const response = await axios.post<RoomInfo>(
			'http://localhost:8000/start-game',
			{
				host: username,
			}
		)

		navigate(`/game/${response.data.roomId}`)

		// Do some error checking here
	}

	return (
		<div className="flex h-screen items-center justify-center bg-red-400">
			<div className="h-4/6 w-4/5 rounded-md bg-gray-500 text-center">
				<h1 className="my-8 text-4xl uppercase tracking-widest">
					New Game
				</h1>

				<hr className="mx-8 mb-8 border-gray-300 " />

				<div>
					<label
						htmlFor="nickname"
						className="mb-2 block text-lg font-semibold"
					>
						Nickname
					</label>
					<input
						type="text"
						id="nickname"
						value={username}
						onChange={handleUsernameChange}
						className=" mx-auto mb-4 block w-64 rounded border border-gray-400 px-4 py-2"
						required
					/>

					<button
						className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
						onClick={handleStartGame}
					>
						Hello World
					</button>
				</div>
			</div>
		</div>
	)
}

export default StartGame
