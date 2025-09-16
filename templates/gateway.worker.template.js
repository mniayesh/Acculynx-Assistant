// This file is generated via scripts/generate.js. Do not edit manually; update templates or data instead.

const OPS = __OPS_ARRAY__;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Meta
      if (request.method === 'GET' && url.pathname === '/gateway/meta') {
        return json({ ok: true, counts: { total: OPS.length }, operations: OPS.map(o => o.operation) });
      }

      // Raw upload passthrough (stream body as-is)
      // Usage: POST /gateway/raw?operation=uploadDocumentRaw OR /gateway/raw?path=/api/v2/uploads/raw&method=POST
      if (url.pathname === '/gateway/raw') {
        const qop = url.searchParams.get('operation');
        const qpath = url.searchParams.get('path');
        const qmethod = (url.searchParams.get('method') || 'POST').toUpperCase();
        const actorUserId = url.searchParams.get('actorUserId') || undefined;

        let entry = null;
        if (qop) entry = OPS.find(o => o.operation === qop);
        if (!entry && qpath) entry = OPS.find(o => o.path === qpath && o.method === qmethod);

        if (!entry) return json({ ok: false, error: { code: 'UNKNOWN_OPERATION_OR_PATH' } }, 400);

        const upstreamUrl = 'https://api.acculynx.com' + entry.path;
        const headers = new Headers(request.headers);
        headers.set('authorization', `Bearer ${selectUpstreamToken(env, actorUserId)}`);

        // Do not forward hop-by-hop headers
        ['host', 'content-length'].forEach(h => headers.delete(h));

        const res = await fetch(upstreamUrl, { method: entry.method, headers, body: request.body });
        return new Response(res.body, { status: res.status, headers: res.headers });
      }

      // JSON dispatch
      if (!(request.method === 'POST' && url.pathname === '/gateway')) {
        return json({ ok: false, error: { code: 'NOT_FOUND' } }, 404);
      }

      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') { return json({ ok: false, error: { code: 'BAD_REQUEST', details: 'Invalid JSON' } }, 400); }

      const { operation, params = {}, timeoutMs = 30000, actorUserId } = body;
      const entry = OPS.find(o => o.operation === operation);
      if (!entry) return json({ ok: false, error: { code: 'UNKNOWN_OPERATION', operation } }, 400);

      const upstreamUrl = buildUrl('https://api.acculynx.com' + entry.path, params.path, params.query);
      const method = entry.method;
      const contentType = params.contentType || 'application/json';

      const headers = new Headers({ 'accept': 'application/json' });
      headers.set('authorization', `Bearer ${selectUpstreamToken(env, actorUserId)}`);

      let upstreamBody = undefined;
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        if (contentType === 'multipart/form-data') {
          const form = new FormData();
          for (const [k, v] of Object.entries(params.body || {})) form.append(k, String(v));
          upstreamBody = form;
          // let runtime set content-type boundary
        } else if (contentType === 'application/x-www-form-urlencoded') {
          const form = new URLSearchParams();
          for (const [k, v] of Object.entries(params.body || {})) form.set(k, String(v));
          headers.set('content-type', 'application/x-www-form-urlencoded');
          upstreamBody = form;
        } else {
          headers.set('content-type', 'application/json');
          upstreamBody = params.body ? JSON.stringify(params.body) : undefined;
        }
      }

      const res = await fetchWithTimeout(upstreamUrl, { method, headers, body: upstreamBody }, timeoutMs);
      const text = await res.text();
      const ctype = res.headers.get('content-type') || '';
      let data = text;
      if (ctype.includes('application/json')) { try { data = JSON.parse(text); } catch {} }

      return new Response(ctype.includes('application/json') ? JSON.stringify(data) : text, { status: res.status, headers: { 'content-type': ctype.includes('application/json') ? 'application/json' : 'text/plain' } });
    } catch (err) {
      return json({ ok: false, error: { code: 'GATEWAY_ERROR', message: String(err?.stack || err) } }, 500);
    }
  }
};

// ======== helpers ========
function buildUrl(template, pathVars = {}, query = {}) {
  let url = template.replace(/\{(.*?)\}/g, (_, k) => encodeURIComponent(String(pathVars?.[k] ?? '')));
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query || {})) { if (v !== undefined && v !== null && v !== '') qs.set(k, String(v)); }
  const q = qs.toString();
  if (q) url += (url.includes('?') ? '&' : '?') + q;
  return url;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}

async function fetchWithTimeout(url, init, timeoutMs = 30000) {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(to);
  }
}

function selectUpstreamToken(env, actorUserId) {
  if (actorUserId) {
    const key = `ACCULYNX_TOKEN__${actorUserId}`;
    if (env[key]) return env[key];
  }
  return env.ACCULYNX_TOKEN;
}
