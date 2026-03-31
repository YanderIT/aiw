import { createRequire } from "module";
import path from "path";

const PROXY_ENABLED_KEY = Symbol.for("app.server-fetch-proxy.enabled");
const PROXY_URL_KEY = Symbol.for("app.server-fetch-proxy.url");
const PROXY_AGENTS_KEY = Symbol.for("app.server-fetch-proxy.agents");

type FetchType = typeof fetch;
type ProxyCapableInit = RequestInit & {
  dispatcher?: unknown;
};

const LOCAL_PROXY_CANDIDATES = [
  "http://127.0.0.1:7890",
  "http://127.0.0.1:7897",
];
const requireFromHere = createRequire(import.meta.url);

function getGlobalState() {
  return globalThis as typeof globalThis & {
    [PROXY_ENABLED_KEY]?: boolean;
    [PROXY_URL_KEY]?: string;
    [PROXY_AGENTS_KEY]?: Map<string, unknown>;
  };
}

function isLocalRequest(input: RequestInfo | URL) {
  const value =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  try {
    const url = new URL(value);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    );
  } catch {
    return value.startsWith("/");
  }
}

function getConfiguredProxyUrl() {
  const configuredProxy =
    process.env.AUTH_PROXY_URL ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    "";

  if (configuredProxy) {
    return configuredProxy;
  }

  return LOCAL_PROXY_CANDIDATES[0];
}

function loadProxyAgent(proxyUrl: string) {
  // `undici` is available in pnpm's shared node_modules tree in this repo.
  // Importing via package name fails here because it is not hoisted to the root.
  const undiciPath = path.resolve(
    process.cwd(),
    "node_modules/.pnpm/node_modules/undici"
  );
  const { ProxyAgent } = requireFromHere(undiciPath);
  return new ProxyAgent(proxyUrl);
}

function getProxyAgents(proxyUrl: string) {
  const state = getGlobalState();
  if (!state[PROXY_AGENTS_KEY]) {
    state[PROXY_AGENTS_KEY] = new Map();
  }

  const configured = process.env.AUTH_PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  const proxyUrls = configured ? [proxyUrl] : LOCAL_PROXY_CANDIDATES;

  for (const candidate of proxyUrls) {
    if (!state[PROXY_AGENTS_KEY]!.has(candidate)) {
      state[PROXY_AGENTS_KEY]!.set(candidate, loadProxyAgent(candidate));
    }
  }

  return state[PROXY_AGENTS_KEY]!;
}

function shouldRetryWithProxy(error: unknown) {
  const cause = (error as any)?.cause;
  return (
    (cause && cause.code === "UND_ERR_CONNECT_TIMEOUT") ||
    (error as any)?.message === "fetch failed"
  );
}

function patchFetch(proxyUrl: string) {
  const originalFetch = globalThis.fetch as FetchType;
  const proxyAgents = getProxyAgents(proxyUrl);

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    if (isLocalRequest(input)) {
      return originalFetch(input, init);
    }

    const hasCustomDispatcher = Boolean(
      (init as ProxyCapableInit | undefined)?.dispatcher
    );

    if (!hasCustomDispatcher) {
      for (const [candidate, dispatcher] of proxyAgents.entries()) {
        try {
          const nextInit: ProxyCapableInit = {
            ...(init || {}),
            dispatcher,
          };

          const response = await originalFetch(input, nextInit);
          getGlobalState()[PROXY_URL_KEY] = candidate;
          return response;
        } catch (error) {
          if (!shouldRetryWithProxy(error)) {
            throw error;
          }
        }
      }
    }

    return originalFetch(input, init);
  }) as FetchType;
}

export function initServerFetchProxy() {
  if (typeof window !== "undefined") {
    return;
  }

  const state = getGlobalState();
  if (state[PROXY_ENABLED_KEY]) {
    return;
  }

  const proxyUrl = getConfiguredProxyUrl();
  if (!proxyUrl) {
    state[PROXY_ENABLED_KEY] = true;
    return;
  }

  try {
    patchFetch(proxyUrl);
    state[PROXY_URL_KEY] = proxyUrl;
  } catch (error) {
    console.error("[server-fetch-proxy] failed to enable proxy", error);
  } finally {
    state[PROXY_ENABLED_KEY] = true;
  }
}

export function getServerFetchProxyUrl() {
  const state = getGlobalState();
  return state[PROXY_URL_KEY] || "";
}
