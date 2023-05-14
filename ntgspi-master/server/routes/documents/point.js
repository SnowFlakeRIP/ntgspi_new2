const job = require('../../handlers/documents/handler')
const { checkTokenAndSetRequest } = require( "../../dependes" );

module.exports = function (fastify, opts, next) {
    fastify.route({
        method: "POST",
        url: '/less18',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.DOPWithLess18(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/customer',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.DOPWithCustomer(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/upgradeQualify',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.upgradeQualify(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/profReset',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.profReset(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/consentPersonalCustomer',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.consentPersonalCustomer(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/consentPersonalLess18',
        schema: {
            body: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'number'
                    },
                    courseId: {
                        type: 'number'
                    }
                },
                required: ['userId', 'courseId']
            }
        },
        async handler(request, reply) {
            const data = await job.consentPersonalLess18(request.body)
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    fastify.route({
        method: "POST",
        url: '/KPKAndPP',
        schema: {
            body: {
                type: 'object',
                properties: {
                    courseId: {
                        type: 'number'
                    }
                },
                required: [ 'courseId']
            }
        },
        async handler(request, reply) {
            try {
                if(request.raw.url !== '/courses/all'){
                    let ch = await checkTokenAndSetRequest( request )
                    console.log( ch )
                    if ( !ch ) {
                        reply.code( 403 )
                        reply.send( {
                            message:   'Access denied',
                            statusCode:403
                        } )
                    }
                }
            }
            catch ( e ) {
                console.error( e )
            }
            const data = await job.KPKAndPP( {
                ...request.body,
                ...request.info
            })
            if (data.statusCode !== 200) {
                reply.status(400)
            }
            reply.header('Content-Type', 'application/pdf')
            reply.send(data.message)
        }
    })

    next();
}

module.exports.autoPrefix = '/documents'