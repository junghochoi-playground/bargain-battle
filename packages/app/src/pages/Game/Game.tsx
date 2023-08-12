import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import {
	ServerToClientEvents,
	ClientToServerEvents,
} from '@bargain-battle/wss/events'
let socket: Socket<ServerToClientEvents, ClientToServerEvents>

type User = {
	username: string
	socketId: string
}

async function getSocketConnection() {
	// socket = io(process.env.WSS_URL!) // KEEP AS IS
	socket = io('http://localhost:8000')
}

const Game: React.FC = (props) => {
	let { id: roomId } = useParams<string>()
	const [isConnected, setIsConnected] = useState<boolean>(false)
	const [users, setUsers] = useState<User[]>([])

	const location = useLocation()

	const startGameEventHandlers = () => {
		socket.on('UserJoin', (payload) => {
			console.log(payload)
			const joinedUser = {
				username: payload.username,
				socketId: socket.id,
			}
			setUsers((prev) => [...prev, joinedUser])
		})
	}
	useEffect(() => {
		console.log('useEffect')
		getSocketConnection().then(() => {
			startGameEventHandlers()
			socket.on('connect', () => {
				if (roomId) {
					socket.emit('UserJoin', {
						username: location.state.name as string,
						socketId: socket.id,
						roomId: roomId,
					})
				}
			})
		})

		return () => {}
	}, [])

	return (
		<div>
			<h1 className="">This is the Game Page</h1>

			<ul>
				{users.map((user) => (
					<li key={user.socketId}>{user.username}</li>
				))}
			</ul>
		</div>
	)
}

export default Game
