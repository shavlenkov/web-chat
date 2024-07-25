import http from 'http'
import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import { createClient, RedisClientType } from 'redis'

import { UserInterface } from './interfaces/user.interface'
import { MessageInterface } from './interfaces/message.interface'
;(async () => {
    const client: RedisClientType = createClient({
        url: 'redis://redis:6379'
    })

    client.on('error', (err: Error) => console.log('Redis Client Error', err))

    await client.connect()

    const app = express()
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST']
        }
    })

    app.use(
        cors({
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST', 'DELETE']
        })
    )
    app.use(express.static('public'))

    const users: Record<string, UserInterface> = {}

    app.get('/create-room', (req: Request, res: Response) => {
        res.json({ roomId: uuidv4() })
    })

    app.get('/check-room', async (req: Request, res: Response) => {
        res.json({
            has: Boolean(await client.exists(String(req.query.roomId)))
        })
    })

    app.delete('/delete-room', async (req: Request, res: Response) => {
        if (await client.exists(String(req.query.roomId))) {
            await client.del(String(req.query.roomId))

            res.json({ success: true })
        }
    })

    io.on('connection', socket => {
        socket.on('set-nickname', (newNickname: string, roomId: string) => {
            if (users[socket.id]) {
                users[socket.id].nickname = newNickname
                io.in(roomId).emit(
                    'user-list',
                    Object.values(users).filter(user => user.roomId === roomId)
                )
            }
        })

        socket.on('join-room', async (roomId: string, nickname: string) => {
            socket.join(roomId)

            users[socket.id] = { nickname, roomId, status: 'Online' }

            socket.emit('room-id', roomId)

            if (!(await client.exists(roomId))) {
                await client.set(roomId, JSON.stringify([]))
            }

            io.in(roomId).emit(
                'user-list',
                Object.values(users).filter(user => user.roomId === roomId)
            )

            const messages = JSON.parse(
                (await client.get(roomId)) as string
            ) as MessageInterface[]

            socket.emit('list-messages', messages)

            socket.on('chat-message', async (msg: MessageInterface) => {
                const messages = JSON.parse(
                    (await client.get(roomId)) as string
                ) as MessageInterface[]

                messages.push({
                    nickname: msg.nickname,
                    text: msg.text,
                    date: msg.date
                })

                await client.set(roomId, JSON.stringify(messages))

                io.in(roomId).emit('chat-message', msg)
            })

            socket.on('nickname-changed', (newNickname: string) => {
                users[socket.id].nickname = newNickname

                io.emit('users-updated', users)
            })

            socket.on('change-status', (status: string) => {
                users[socket.id].status = status

                io.in(roomId).emit(
                    'user-list',
                    Object.values(users).filter(user => user.roomId === roomId)
                )
            })

            socket.on('disconnect', () => {
                const user = users[socket.id]

                if (user) {
                    const roomId = user.roomId

                    delete users[socket.id]

                    io.in(roomId).emit(
                        'user-list',
                        Object.values(users).filter(
                            user => user.roomId === roomId
                        )
                    )
                }
            })
        })
    })

    server.listen(3000, () => {
        console.log('Server listening on port 3000')
    })
})()
