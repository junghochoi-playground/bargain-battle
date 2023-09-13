import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import axios from 'axios'
import Cookies from 'js-cookie'
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

	const location = useLocation()

	const startGameEventHandlers = () => {
		socket.on('SessionCreate', ({ sessionID }) => {
			console.log(`SessionId: ${sessionID}`)
			localStorage.setItem('sessionId', sessionID)
		})

		socket.on('GameStateUpdate', (gameState) => {
			setUsers(gameState.raceState.participants)
		})
	}
	useEffect(() => {
		async function getSocketConnection() {
			// socket = io(process.env.WSS_URL!) // KEEP AS IS

			socket = io('http://localhost:8000', { autoConnect: false })
			const sessionId = localStorage.getItem('sessionId')
			if (sessionId) {
				// this.usernameAlreadySelected = true;
				socket.auth = {
					sessionId,
					roomId,
					username: location.state.name,
				}

				console.log('socket auth headers set')
			}

			socket.connect()
		}

		getSocketConnection().then(() => {
			startGameEventHandlers()

			// socket.on('connect', () => {
			// 	if (roomId) {
			// 		socket.emit('UserJoin', {
			// 			username: location.state.name as string,
			// 			socketId: socket.id,
			// 			roomId: roomId,
			// 		})
			// 	}
			// })
		})

		// return () => {
		// 	if (roomId) {
		// 		socket.emit('UserLeave', {
		// 			username: location.state.name as string,
		// 			socketId: socket.id,
		// 			roomId: roomId,
		// 		})
		// 	}

		// 	socket.off('connect')
		// 	socket.disconnect()
		// }
	}, [])

	return (
		<div>
			<h1 className="">This is the Game Page</h1>

			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.username}</li>
				))}
			</ul>
		</div>
	)
}

export default Game
