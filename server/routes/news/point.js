const {checkTokenAndSetRequest} = require('../../dependes')
const job = require('../../handlers/news/handler')
module.exports = function (fastify, opts, next) {

    fastify.route({
        url: '/show/all',
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
            let data = await job.showNews(request.body);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });

    fastify.route({
        url: '/show/detailed',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    newsId:{type:'number'}
                },
                required: [],
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
            let data = await job.showNewsDetailed(request.body);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });



    next()
}