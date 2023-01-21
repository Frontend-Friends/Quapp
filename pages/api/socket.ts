import { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { db } from '../../config/firebase'

interface SocketServer extends HTTPServer {
  io?: Server | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

let unsubscribe: Unsubscribe

export default function socket(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    const io = new Server(res.socket.server)
    res.socket.server.io = io
    io.on('connection', (sock) => {
      unsubscribe = onSnapshot(
        doc(db, 'msg', req.query.id as string),
        (item) => {
          sock.broadcast.emit(req.query.id as string, {
            data: item.data(),
          })
        }
      )
    })
  }
  if (unsubscribe) {
    unsubscribe()
  }
  res.end()
}
