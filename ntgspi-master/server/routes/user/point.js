const job = require('../../handlers/user/handler')
const {checkTokenAndSetRequest} = require('../../dependes')

module.exports = function (fastify, opts, next) {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            let ch = await checkTokenAndSetRequest(request)
            console.log(ch)
            if (!ch) {
                reply.code(403)
                reply.send({message: 'Access denied', statusCode: 403})
            }
        } catch (e) {
            console.error(e)
        }
    })

    fastify.route({
        method: 'POST',
        url: '/setUserData',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userPhone: {
                        type: 'string'
                    },
                    passportSerial: {
                        type: 'string'
                    },
                    passportNumber: {
                        type: 'string'
                    },
                    lastName: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    middleName: {
                        type: 'string'
                    },
                    dateBirth: {
                        type: 'string'
                    },
                    gender:{
                        type:'string'
                    },
                    city:{
                        type:'string'
                    },
                    email:{
                        type:'string'
                    }
                }
            }
        },
        async handler(request, reply) {
            const data = await job.setUserData(request.body, request.info)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: 'GET',
        url: '/getUserData',
        async handler(request, reply) {
            const data = await job.getUserData(request.body, request.info)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "POST",
        url: '/joinToCourse',
        schema: {
            body: {
                type: 'object',
                properties: {
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.joinToCourse(request.body, request.info)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "GET",
        url: '/myCourse',
        async handler(request, reply) {
            const data = await job.myCourse(request.body, request.info)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "GET",
        url: '/myCourse/reg',
        async handler(request, reply) {
            const data = await job.getCourseReg(request.body, request.info)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    next()
}

module.exports.autoPrefix = '/user'