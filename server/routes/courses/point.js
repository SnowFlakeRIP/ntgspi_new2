const job = require('../../handlers/courses/handler')
const admin = require('../../handlers/admin/handler')
const {checkTokenAndSetRequest} = require('../../dependes')

module.exports = function (fastify, opts, next) {
    fastify.route({
        url: '/detailed',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    courseid:{type:'number'}
                },
                required: ['courseid'],
            },
            response: {
                400: {
                    type: 'object',
                    properties: {
                        message: {type: 'string'},
                        statusCode: {type: 'integer'},
                    },
                },
            },
        },
        async handler(request, reply) {
            let data = await job.getCourseDetailed(request.body, request.info);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });
    fastify.route({
        url: '/all',
        method: 'GET',
        schema: {
            response: {
                400: {
                    type: 'object',
                    properties: {
                        message: {type: 'string'},
                        statusCode: {type: 'integer'},
                    },
                },
            },
        },
        async handler(request, reply) {
            let data = await job.getAllCourses(request.body, request.info);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });
    next()
}
