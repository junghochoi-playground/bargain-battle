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
	// const [isConnected, setIsConnected] = useState<boolean>(false)
	const [users, setUsers] = useState<Participant[]>([])
	const [currUser, setCurrUser] = useState<Participant>()

	async function getSocketConnection(username: string) {
		// socket = io(process.env.WSS_URL!) // KEEP AS IS
		socket = io('http://localhost:8000', { autoConnect: false })
		const sessionId = localStorage.getItem('sessionId')
		if (sessionId) {
			// this.usernameAlreadySelected = true;
			socket.auth = {
				sessionId,
				roomId,
				username,
			}
		}
		socket.connect()
	}

	const startGameEventHandlers = () => {
		socket.on('UserInitialization', ({ sessionID, userId, username }) => {
			console.log(`SessionId: ${sessionID}`)
			localStorage.setItem('sessionId', sessionID)
			setCurrUser({
				id: userId,
				roomId,
				username,
			})
		})

		socket.on('GameStateUpdate', (gameState) => {
			setUsers(gameState.raceState.participants)
		})
	}

	const handleUserJoinGame = async (username: string) => {
		await getSocketConnection(username)
		startGameEventHandlers()
		console.log('joining game')
	} // TODO: Add a handler for pressing the button

	// useEffect(() => {
	// 	if (currUser !== undefined) {
	// 		getSocketConnection().then(() => {
	// 			startGameEventHandlers()
	// 		})
	// 	}
	// }, [currUser])

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
