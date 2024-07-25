import http from 'http'
import { Server, Socket } from 'socket.io'
import ioClient from 'socket.io-client'
import express, { Request, Response } from 'express'
import request from 'supertest'
import { createClient, RedisClientType } from 'redis'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'

import { UserInterface } from '../src/interfaces/user.interface'
import { MessageInterface } from '../src/interfaces/message.interface'

const setupServer = () => {
    const app = express()
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST']
        }
    })

    const client: RedisClientType = createClient()

    client.on('error', (err: Error) => console.log('Redis Client Error', err))
    ;(async () => {
        await client.connect()
    })()

    app.use(
        cors({
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST']
        })
    )

    app.use(express.static('public'))

    const users: Record<string, UserInterface> = {}

    app.get('/create-room', (req: Request, res: Response) => {
        const roomId = uuidv4()
        res.json({ roomId })
    })

    io.on('connection', (socket: Socket) => {
        const { nickname } = socket.handshake.query as { nickname: string }

        socket.on('join-room', async (roomId: string) => {
            socket.join(roomId)
            users[socket.id] = { nickname, roomId, status: 'Online' }

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

                messages.push({ nickname, text: msg.text, date: msg.date })
                await client.set(roomId, JSON.stringify(messages))
                io.in(roomId).emit('chat-message', msg)
            })

            socket.on(
                'reaction',
                ({ index, reaction }: { index: number; reaction: string }) => {
                    io.in(roomId).emit('reaction', { index, reaction })
                }
            )

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

    const PORT = process.env.PORT || 3000

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })

    return { app, server, client }
}

describe('Express and Socket.IO Server', () => {
    let app: express.Express
    let server: http.Server
    let client: RedisClientType
    const serverUrl = 'http://localhost:3000'

    beforeAll(() => {
        ;({ app, server, client } = setupServer())
    })

    afterAll(async () => {
        await client.quit()
        server.close()
    })

    test('GET /create-room should return room details', async () => {
        const response = await request(app).get('/create-room')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('roomId')
    })

    test('Socket.IO connection and room join', done => {
        const socket = ioClient(serverUrl, {
            query: { nickname: 'testUser' }
        })

        socket.on('connect', () => {
            socket.emit('join-room', 'testRoom')
        })

        socket.on('user-list', (users: UserInterface[]) => {
            expect(users).toEqual(expect.arrayContaining([]))
            done()
        })
    })
})
