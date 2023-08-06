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

async function getSocketConnection() {
	socket = io(process.env.WSS_URL!) // KEEP AS IS
}

const Game: React.FC = (props) => {
	let { id } = useParams()
	const [isConnected, setIsConnected] = useState<boolean>(false)

	const location = useLocation()

	useEffect(() => {
		console.log(location.state)
		// getSocketConnection().then()
		// 	socket.connect()

		// 	const onConnect = () => {f
		// 		setIsConnected(true)
		// 		socket.emit('UserJoin', {
		// 			username: 'hello',
		// 			socketId: 'hello',
		// 			roomId: 'ehllo',
		// 		})
		// 	}
		// 	const onDisconnect = () => setIsConnected(false)

		// 	socket.on('connect', () => onConnect())
		// 	socket.on('disconnect', () => onDisconnect())

		// 	return () => {
		// 		socket.off('connect')
		// 		socket.disconnect()
		// 	}
	}, [])

	return (
		<div>
			<h1 className="">This is the Game Page</h1>
			{isConnected && <h2>You are connected</h2>}

			<input type="text" />
		</div>
	)
}

export default Game
