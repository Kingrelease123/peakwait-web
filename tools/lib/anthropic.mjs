/**
 * One hardened call to the Anthropic Messages API, for scripts that run unattended.
 *
 * Two unattended jobs have now died on the same class of problem, weeks apart:
 *
 *   2026-09-01  the monthly legal review capped max_tokens at 4,000; the model spent the budget
 *               thinking and returned no text at all.
 *   2026-08-31  the weekly marketing loop made one un-retried `fetch` and was killed at exactly
 *               five minutes by undici's default headers timeout. A long completion is normal for
 *               these prompts, so the default is simply too short — and nothing retried.
 *
 * Nobody is watching when these run, so the failure is silent until someone asks why the guides
 * stopped. This wrapper is the shared answer: a real timeout, retries with backoff on the errors
 * that are worth retrying, and the response body handed back whole so the caller can check
 * `stop_reason` before it looks at any text.
 */

const ENDPOINT = "https://api.anthropic.com/v1/messages";

/** Transient by nature: overloaded, rate-limited, gateway hiccup, or the socket giving up. */
function retriable(status, err) {
  if (err) return true; // network/abort — always worth one more go
  return status === 408 || status === 409 || status === 429 || status >= 500;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {object} body           Messages API request body (model, max_tokens, messages, ...).
 * @param {object} [opts]
 * @param {string} [opts.apiKey]  Defaults to ANTHROPIC_API_KEY.
 * @param {number} [opts.timeoutMs]  Per attempt. Default 15 min — these prompts are large.
 * @param {number} [opts.retries]    Extra attempts after the first. Default 3.
 * @returns {Promise<object>}     The parsed response. Check `stop_reason` before reading text.
 */
export async function callAnthropic(body, opts = {}) {
  const apiKey = opts.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  const timeoutMs = opts.timeoutMs ?? 15 * 60_000;
  const retries = opts.retries ?? 3;

  let lastDetail = "";
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (attempt > 0) {
      const wait = Math.min(60_000, 2000 * 2 ** (attempt - 1));
      console.error(`retrying in ${Math.round(wait / 1000)}s (attempt ${attempt + 1}/${retries + 1}) — ${lastDetail}`);
      await sleep(wait);
    }
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify(body),
        // The default headers timeout is five minutes, which these prompts legitimately exceed.
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      lastDetail = `${err?.name ?? "fetch failed"}: ${err?.message ?? err}`;
      if (attempt === retries) throw new Error(`Anthropic request failed after ${retries + 1} attempts — ${lastDetail}`);
      continue;
    }

    const raw = await res.text();
    if (!res.ok) {
      lastDetail = `HTTP ${res.status}: ${raw.slice(0, 500)}`;
      if (retriable(res.status, null) && attempt < retries) continue;
      throw new Error(`Anthropic API error ${lastDetail}`);
    }
    try {
      return JSON.parse(raw);
    } catch {
      lastDetail = `HTTP ${res.status} but the body is not JSON: ${raw.slice(0, 500)}`;
      if (attempt < retries) continue;
      throw new Error(lastDetail);
    }
  }
  throw new Error("unreachable");
}

/** Every text block joined. A thinking block has no `.text`, so never index content[0] blindly. */
export function textOf(data) {
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
}
