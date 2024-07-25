'use strict'
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
const http_1 = __importDefault(require('http'))
const socket_io_1 = require('socket.io')
const socket_io_client_1 = __importDefault(require('socket.io-client'))
const express_1 = __importDefault(require('express'))
const supertest_1 = __importDefault(require('supertest'))
const redis_1 = require('redis')
const uuid_1 = require('uuid')
const cors_1 = __importDefault(require('cors'))
const setupServer = () => {
    const app = (0, express_1.default)()
    const server = http_1.default.createServer(app)
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST']
        }
    })
    const client = (0, redis_1.createClient)()
    client.on('error', err => console.log('Redis Client Error', err))
    ;(() =>
        __awaiter(void 0, void 0, void 0, function* () {
            yield client.connect()
        }))()
    app.use(
        (0, cors_1.default)({
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST']
        })
    )
    app.use(express_1.default.static('public'))
    const users = {}
    app.get('/create-room', (req, res) => {
        const roomId = (0, uuid_1.v4)()
        res.json({ roomName: req.query.roomName, roomId })
    })
    io.on('connection', socket => {
        const { nickname } = socket.handshake.query
        socket.on('join-room', roomName =>
            __awaiter(void 0, void 0, void 0, function* () {
                socket.join(roomName)
                users[socket.id] = { nickname, roomName, status: 'Online' }
                if (!(yield client.exists(roomName))) {
                    yield client.set(roomName, JSON.stringify([]))
                }
                io.in(roomName).emit(
                    'user-list',
                    Object.values(users).filter(
                        user => user.roomName === roomName
                    )
                )
                const messages = JSON.parse(yield client.get(roomName))
                socket.emit('list-messages', messages)
                socket.on('chat-message', msg =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        const messages = JSON.parse(yield client.get(roomName))
                        messages.push({
                            nickname,
                            text: msg.text,
                            date: msg.date
                        })
                        yield client.set(roomName, JSON.stringify(messages))
                        io.in(roomName).emit('chat-message', msg)
                    })
                )
                socket.on('reaction', ({ index, reaction }) => {
                    io.in(roomName).emit('reaction', { index, reaction })
                })
                socket.on('change-status', status => {
                    users[socket.id].status = status
                    io.in(roomName).emit(
                        'user-list',
                        Object.values(users).filter(
                            user => user.roomName === roomName
                        )
                    )
                })
                socket.on('disconnect', () => {
                    const user = users[socket.id]
                    if (user) {
                        const roomName = user.roomName
                        delete users[socket.id]
                        io.in(roomName).emit(
                            'user-list',
                            Object.values(users).filter(
                                user => user.roomName === roomName
                            )
                        )
                    }
                })
            })
        )
    })
    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
    return { app, server, client } // Removed io
}
describe('Express and Socket.IO Server', () => {
    let app
    let server
    let client
    const serverUrl = 'http://localhost:3000'
    beforeAll(() => {
        ;({ app, server, client } = setupServer())
    })
    afterAll(() =>
        __awaiter(void 0, void 0, void 0, function* () {
            yield client.quit()
            server.close()
        })
    )
    test('GET /create-room should return room details', () =>
        __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(
                '/create-room?roomName=testRoom'
            )
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('roomName', 'testRoom')
            expect(response.body).toHaveProperty('roomId')
        }))
    test('Socket.IO connection and room join', done => {
        const socket = (0, socket_io_client_1.default)(serverUrl, {
            query: { nickname: 'testUser' }
        })
        socket.on('connect', () => {
            socket.emit('join-room', 'testRoom')
        })
        socket.on('user-list', users => {
            expect(users).toEqual(expect.arrayContaining([])) // Adjust as needed
            done()
        })
    })
})
