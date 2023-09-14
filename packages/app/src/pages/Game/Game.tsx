import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import UsernameSelection from './UsernameSelection'
// import invariant from '@/util/util'

import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '@bargain-battle/wss/events'
import { Participant } from '@bargain-battle/wss/types'
let socket: Socket<ServerToClientEvents, ClientToServerEvents>

const Game: React.FC = () => {
	let { id: roomId } = useParams<string>()

	const [userId, setUserId] = useState<string>('')
	// const [isConnected, setIsConnected] = useState<boolean>(false)
	const [users, setUsers] = useState<Participant[]>([])
	const [currUser, setCurrUser] = useState<Participant>()

	async function getSocketConnection() {
		// socket = io(process.env.WSS_URL!) // KEEP AS IS
		socket = io('http://localhost:8000', { autoConnect: false })
		const sessionId = localStorage.getItem('sessionId')
		if (sessionId) {
			// this.usernameAlreadySelected = true;
			socket.auth = {
				sessionId,
				roomId,
			}
		}
		socket.connect()
	}

	const startGameEventHandlers = () => {
		socket.on('UserInitialization', ({ sessionID, userId }) => {
			console.log(`SessionId: ${sessionID}`)

			// ! ----- LOOK AT THIS TODO -------
			// TODO: Get Userdata for this UserInitialization Payload and if it exists, set currUser
			// TODO: Potentially remove the userId State

			setUserId(userId)
			localStorage.setItem('sessionId', sessionID)
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
				id: userId,
			})
		}
	} // TODO: Add a handler for pressing the button

	useEffect(() => {
		getSocketConnection().then(() => startGameEventHandlers())
	}, [])

	return (
		<div>
			{currUser !== undefined && (
				<>
					<h1 className="">This is the Game Page</h1>
					<ul>
						{users.map((user) => (
							<li key={user.id}>{user.username}</li>
						))}
					</ul>
				</>
			)}

			{currUser === undefined && (
				<UsernameSelection handleUserJoinGame={handleUserJoinGame} />
			)}
		</div>
	)
}

export default Game
