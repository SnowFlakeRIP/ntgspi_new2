const job = require('../../handlers/registration/handler')

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: "POST",
        url: '/register',
        schema: {
            body: {
                type: 'object',
                properties: {
                    password: {
                        type: 'string',
                    },
                    email: {
                        type: 'string'
                    },
                    login: {
                        type: 'string'
                    }
                }
            }
        },
        async handler(request, reply) {
            const data = await job.registrationUser(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "POST",
        url: '/auth',
        schema: {
            body: {
                type: 'object',
                properties: {
                    password: {
                        type: 'string',
                    },
                    login: {
                        type: 'string'
                    }
                }
            }
        },
        async handler(request, reply) {
            const data = await job.authorizationUser(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            } else if (data.token) {
                reply.send({token:data.token,message:'Вы успешно авторизовались'})
            }
            reply.send({
                message: data.message,
                success: data.success,
                statusCode: data.statusCode
            })
        }
    })

    fastify.route({
        method: "POST",
        url: '/clearPassword',
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: {type: 'string'}
                }
            }
        },
        async handler(request, reply) {
            const data = await job.sendEmailToResetPassword(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "POST",
        url: '/checkCode',
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string'
                    },
                    code: {
                        type: 'string'
                    }
                }
            }
        },
        async handler(request, reply) {
            const data = await job.checkCode(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "POST",
        url: '/resetPassword',
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: {type: 'string'},
                    password: {type: 'string'}
                },
            }
        },
        async handler(request, reply) {
            const data = await job.resetPassword(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.send(data)
        }
    })

    next()
}

module.exports.autoPrefix = '/check_user'