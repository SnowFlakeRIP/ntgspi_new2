const job = require('../../handlers/admin/handler')
const { checkTokenAndSetRequest } = require( "../../dependes" );
const newsjob = require('../../handlers/news/handler')
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
        method: "GET",
        url: '/courses',
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

    fastify.route({
        url: '/course/create',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    newsTitle:{type:'string'},
                    newsText:{type:'string'},
                    newsDate:{type:'string'},
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
            let data = await newsjob.createNews(request.body, request.info, request.raw.url, request.headers);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });

    fastify.route({
        url:    '/news/file/add',
        method: 'POST',
        schema: {
            body:     {
                type:       'object',
                properties: {
                    newsId: { type: 'number' },
                    file:          {
                        type:  'array',
                        items: fastify.getSchema('MultipartFileType'),
                    },
                },
                required:   [ 'newsId', 'file' ],
            },
            response: {

                400: {
                    type:       'object',
                    properties: {
                        message:    { type: 'string' },
                        statusCode: { type: 'integer' },
                    },
                },
            },
        },
        async handler(request, reply) {
            let data = await newsjob.uploadImage(request.body);
            if (data.statusCode !== 200) {
                reply.status(400);
            }
            reply.send(data);
        },
    });

    fastify.route({
        method: 'POST',
        url: '/course/isPaid',
        schema: {
            body: {
                type: 'object',
                properties: {
                    id:{type:'number'}
                }
            }
        },
        async handler(request, reply) {
            const data = await job.setIsPaid(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: 'GET',
        url: '/course/req',
        async handler(request, reply) {
            const data = await job.getRequests(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    fastify.route({
        method: 'POST',
        url: '/req/confirm',
        async handler(request, reply) {
            const data = await job.confirmCourseRequest(request.body)
            if (data.statusCode !== 200) {
                reply.code(400)
            }
            reply.send(data)
        }
    })

    next();
}

