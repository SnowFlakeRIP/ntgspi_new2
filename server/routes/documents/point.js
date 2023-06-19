const job = require('../../handlers/documents/handler')
const { checkTokenAndSetRequest } = require( "../../dependes" );
const QRCode = require('qrcode');
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
            }
        },
        async handler(request, reply) {
            let ch = await checkTokenAndSetRequest( request )
            console.log( ch )
            if ( !ch ) {
                reply.code( 403 )
                reply.send( {
                    message:   'Access denied',
                    statusCode:403
                } )
            }
            const data = await job.DOPWithCustomer( {
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
                }
            }
        },
        async handler(request, reply) {
            let ch = await checkTokenAndSetRequest( request )
            console.log( ch )
            if ( !ch ) {
                reply.code( 403 )
                reply.send( {
                    message:   'Access denied',
                    statusCode:403
                } )
            }
            const data = await job.consentPersonalCustomer( { ...request.body, ...request.info })
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

    fastify.route({
        method: 'POST',
        url:    '/invoice_payment',
        schema: {
            body:     {
                type:       'object',
                properties: {
                    requisit:    { type: 'integer' },
                    amaunt:      { type: 'string' },
                    amauntText:  { type: 'string' },
                    projectId:   { type: 'integer', nullable: true },
                    projectName: { type: 'string', nullable: true },
                    pdf:         { type: 'boolean' },
                    date:        { type: 'string' },
                    inn:         {type:'string'}
                },
            },
        },
        async handler (request, reply) {
            let ch = await checkTokenAndSetRequest( request );
            if ( ch ) {
                // ГОСТ https://docs.cntd.ru/document/1200110981 (все по нему)
                let data = await job.invoicePayment( {
                    ...request
                    .body,
                   ...request
                    .info
                });
                reply.header('Content-Type', 'application/pdf')
                reply.send(data.message)
            }
        },
    } );
    
    fastify.route({
        method: 'POST',
        url:    '/final',
        async handler(request, reply) {
            // ГОСТ https://docs.cntd.ru/document/1200110981 (все по нему)
            let data = await job.final();
            reply.header('Content-Type', 'application/pdf');
            reply.send(data.message);
        },
    });
    
    next();
}

module.exports.autoPrefix = '/documents'
