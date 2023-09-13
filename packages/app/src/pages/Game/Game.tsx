import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
	const [currUser, setCurrUser] = useState<Participant>()

	const startGameEventHandlers = () => {
		socket.on('SessionCreate', ({ sessionID }) => {
			console.log(`SessionId: ${sessionID}`)
			localStorage.setItem('sessionId', sessionID)
		})

		socket.on('GameStateUpdate', (gameState) => {
			setUsers(gameState.raceState.participants)
		})
	}

	const onUsernameChange = () => {} // Todo: Add Username handler for input changes
	const handleUserJoinGame = () => {} // TODO: Add a handler for pressing the button

	useEffect(() => {
		if (currUser !== undefined) {
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
			})
		}
	}, [currUser])

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
				<>
					<h1>username needs to be defined</h1>
					<Input />
					<Button>Join Game</Button>
				</>
			)}
		</div>
	)
}

export default Game
