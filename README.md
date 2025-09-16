# Acculynx-Assistant

# Accu Gateway — Cloudflare Worker

A single Worker that:
- Proxies **AccuLynx** operations via `POST /gateway`
- Streams **raw uploads/payloads** to upstream via `POST /gateway/raw`
- Exposes **`GET /gateway/meta`** for discovery of supported operation names
- Supports **multipart form**, **per-user token routing** (`actorUserId`), and **timeout overrides** (`timeoutMs`)


## Quick start

1) Set your upstream AccuLynx API token as a secret:
```bash
wrangler secret put ACCULYNX_TOKEN
```

2) Run locally:
```bash
wrangler dev
```

3) Publish:
```bash
wrangler deploy
```

The Worker requires only one secret (`ACCULYNX_TOKEN`). You may optionally define **per-user** tokens by adding secrets named
`ACCULYNX_TOKEN__<actorUserId>`; when a request includes `actorUserId`, that token is used for the upstream call.

---

## Updating operations & OpenAPI

The gateway routing table and OpenAPI definition are generated from a single source of truth: `data/operations.json`.

1. Update `data/operations.json` with any new or removed AccuLynx operations.
2. Regenerate the worker and spec:

   ```bash
   node scripts/generate.js
   ```

Both `gateway.worker.js` and `gateway.openapi.yaml` are overwritten by the script. Commit the regenerated files together with
any changes to the operations data so the Worker and spec stay in sync.

---

## Endpoints

### `GET /gateway/meta`
Returns operations metadata:
```json
{
  "ok": true,
  "counts": { "total": 123 },
  "operations": ["getUsers", "createLead", "uploadDocumentRaw"]
}
```

### `POST /gateway`
Dispatch an operation by name.

**Body**
```json
{
  "operation": "createLead",
  "actorUserId": "b47f2181-2191-4b14-82e5-335b23faa4d5",
  "timeoutMs": 30000,
  "params": {
    "path": {},
    "query": {},
    "body": {},
    "contentType": "application/json"
  }
}
```

**Notes**
- `params.contentType` supports `application/json`, `multipart/form-data`, and `application/x-www-form-urlencoded`.
- `actorUserId` selects a per-user secret `ACCULYNX_TOKEN__<actorUserId>` if present; otherwise falls back to `ACCULYNX_TOKEN`.
- Response is a passthrough of the upstream result (JSON or text).

### `POST /gateway/raw`
Stream an arbitrary body directly to an upstream endpoint.

**Query parameters**
- `operation` — name from the routing table (preferred), **or**
- `path` + `method` — explicit upstream path and verb
- `actorUserId` — optional, for per-user tokens

**Request body**
- Sent **as-is** (binary or text). Common types include `application/octet-stream`, `application/pdf`, and `image/*`.

**Response**
- Passthrough of upstream response (JSON, text, or binary).

---

## Environment & Auth

- **Secrets required**
  - `ACCULYNX_TOKEN` — used when no `actorUserId`-specific token is found.
  - Optional per-user: `ACCULYNX_TOKEN__<actorUserId>`

- **Gateway auth**
  - This Worker does **not** enforce an inbound Authorization header. If you need gateway auth, add a check in the handler or protect the route at your edge.

---

## Examples

**Create lead**
```bash
curl -X POST "http://localhost:8787/gateway"   -H "content-type: application/json"   -d '{"operation":"createLead","params":{"body":{"firstName":"Ada","lastName":"Lovelace"}}}'
```

**Raw upload (PDF) to a known operation**
```bash
curl -X POST "http://localhost:8787/gateway/raw?operation=uploadDocumentRaw"   --data-binary "@./docs/file.pdf"   -H "content-type: application/pdf"
```

**Raw passthrough to explicit path**
```bash
curl -X POST "http://localhost:8787/gateway/raw?path=/api/v2/uploads/raw&method=POST"   --data-binary "@./docs/file.pdf"   -H "content-type: application/pdf"
```

---

## OpenAPI
The generated specification lives in `gateway.openapi.yaml`. Regenerate it with `node scripts/generate.js` whenever the
operation list changes.
