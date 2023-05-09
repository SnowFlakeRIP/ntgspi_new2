const job = require('../../handlers/admin/handler')

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: "GET",
        url: '/courses/:page',
        schema: {
            params: {
                type: 'object',
                properties: {
                    page: {
                        type: 'number',
                        default: 1
                    }
                }
            }
        },
        async handler(request, reply) {
            const data = await job.getCourse(request.params)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: "POST",
        url: "/course",
        schema: {
            body: {
                type: 'object',
                properties: {

                }
            }
        },
        async handler(request, reply) {
            const data = await job.addCourse(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: 'POST',
        url: '/course/file/add',
        schema: {
            body: {
                type: 'object',
                properties: {
                }
            }
        },
        async handler(request, reply) {
            const data = await job.loadImage(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    next();
}

