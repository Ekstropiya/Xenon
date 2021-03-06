/**
 * Converts Corrosion context into Common Log Format.
 *
 * @param ctx Corrosion middleware context.
 */
export const formatRequest = (ctx) => {
    const res = ctx.remoteResponse;
    const req = ctx.clientRequest;

    return `${req.socket.remoteAddress} "${req.method} ${ctx.url} HTTP/${req.httpVersion}" ${res.statusCode} ${(new TextEncoder().encode(ctx.body)).length}`
}