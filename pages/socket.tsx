import { io } from 'socket.io-client'
import { useAsync } from 'react-use'

export default function Socket() {
  useAsync(async () => {
    await fetch('/api/socket?id=zB08RYYqCEVXlwfKe3cU')
    const socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('zB08RYYqCEVXlwfKe3cU', (data) => {
      console.log(data)
    })
  }, [])
  return <div>Sockets</div>
}
