import handler from 'vinext/server/fetch-handler';
import { accessGate, privateResponse } from './lib/access/gate';
import { chapters, roles, assessment } from './app/content';

export default {
  async fetch(...args: Parameters<typeof handler.fetch>) {
    const [request, env] = args;
    const denied = await accessGate(request, {
      passwordHash: String(env.SITE_PASSWORD_HASH || ''),
      signingKey: String(env.SITE_SESSION_SECRET || ''),
    });
    if (denied) return denied;
    if (new URL(request.url).pathname === '/api/learning') {
      if (request.method !== 'GET')
        return privateResponse(
          new Response('Method not allowed', { status: 405 }),
        );
      return privateResponse(Response.json({ chapters, roles, assessment }));
    }
    return privateResponse(await handler.fetch(...args));
  },
};
