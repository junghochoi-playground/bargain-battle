import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface RoomInfo {
	roomId: string
}

const StartGame = () => {
	const [username, setUsername] = useState<string>('')
	const navigate = useNavigate()

	const handleStartGame = async () => {
		const data = {
			host: username,
		}

		// navigate(`/game/${}`)
		navigate('/game/hardcoded-roomid', {
			state: {
				name: username,
			},
		})

		// Todo: Do some error checking here
	}

	const handleCreateRoomAndRedirect = async () => {
		const response = await axios.get('http://localhost:8000/create-room')
		const roomCode = response.data.roomId
		navigate(`/game/${roomCode}`)
	}

	return (
		<div className="flex h-screen items-center justify-center bg-red-400">
			<div className="h-4/6 w-4/5 rounded-md bg-gray-500 text-center">
				<h1 className="my-8 text-4xl uppercase tracking-widest">
					New Game
				</h1>

				<hr className="mx-8 mb-8 border-gray-300 " />

				<div>
					<Button onClick={handleCreateRoomAndRedirect}>
						Start Game
					</Button>
				</div>
			</div>
		</div>
	)
}

export default StartGame
