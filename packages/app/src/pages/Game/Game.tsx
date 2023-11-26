import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import UsernameSelection from './UsernameSelection'
import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '@bargain-battle/wss/events'
import { Participant } from '@bargain-battle/wss/types'
import { RoomNotFoundError } from '@bargain-battle/wss/errors'

let socket: Socket<ServerToClientEvents, ClientToServerEvents>

const Game: React.FC = () => {
	let { id: roomId } = useParams<string>()
	const [userId, setUserId] = useState<string>('')
	const [users, setUsers] = useState<Participant[]>([])
	const [currUser, setCurrUser] = useState<Participant>()
	const [error, setError] = useState<Error>()

	async function getSocketConnection() {
		// socket = io(process.env.WSS_URL!) // KEEP AS IS
		const sessionId = sessionStorage.getItem('sessionId')
		socket = io('http://localhost:8000', { 
			autoConnect: false,
			auth: {
				roomId
			}
		})
		
		if (sessionId) {
			socket.auth = {
				sessionId,
				...socket.auth
			}
		}

		startGameErrorHandlers()

		socket.connect()
	}

	const startGameErrorHandlers = () => {
		socket.on('connect_error', (err) => {
			console.log(err)
			setError(err)
		})
	}

	const startGameEventHandlers = () => {
		socket.on('UserInitialization', ({ sessionId, userId, userData }) => {
			setUserId(userId)
			if (userData) {
				setCurrUser({
					userId: userData.userId,
					roomId: userData.roomId,
					username: userData.username,
				})
				socket.emit('UserReconnect', {
					userId: userData.userId,
					roomId: userData.roomId,
					username: userData.username,
				})
			}

			sessionStorage.setItem('sessionId', sessionId)
		})

		socket.on('GameStateUpdate', (gameState) => {
			console.log(gameState)
			setUsers(gameState.participants)
		})
	}

	const handleUserJoinGame = async (username: string) => {
		console.log('joining game')

		if (typeof roomId === 'string') {
			socket.emit('UserJoin', {
				username,
				roomId,
				userId,
			})

			setCurrUser({
				username,
				roomId,
				userId: userId,
			})
		}
	}

	useEffect(() => {
		getSocketConnection().then(() => {
			startGameEventHandlers()
		})
	}, [])

	if (error) {
		if (error instanceof RoomNotFoundError) {
			return <div>Room Is not found Error</div>
		} else {
			return <div>General Error</div>
		}
	}

	return (
		<div>
			{currUser === undefined && (
				<UsernameSelection handleUserJoinGame={handleUserJoinGame} />
			)}
			{currUser !== undefined && (
				<>
					<h1 className="">This is the Game Page</h1>
					<ul>
						{users.map((user) => (
							<li key={user.userId}>{user.username}</li>
						))}
					</ul>
				</>
			)}
		</div>
	)
}

export default Game
