const SENSITIVE_CALLBACK_PARAMS = new Set([
  "access_token",
  "refresh_token",
  "expires_at",
  "expires_in",
  "token_type",
  "type",
  "error",
  "error_code",
  "error_description",
  "provider_token",
  "provider_refresh_token",
]);

export function readRecoveryAccessToken(location = window.location) {
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(location.search);
  const callbackType = hashParams.get("type") || searchParams.get("type");
  const accessToken = hashParams.get("access_token") || searchParams.get("access_token");

  if (!accessToken || (callbackType && callbackType !== "recovery")) return null;
  return accessToken;
}

export function clearRecoveryCallbackUrl(
  location = window.location,
  history = window.history
) {
  const searchParams = new URLSearchParams(location.search);
  const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
  let changed = false;

  for (const param of SENSITIVE_CALLBACK_PARAMS) {
    if (searchParams.has(param)) {
      searchParams.delete(param);
      changed = true;
    }
    if (hashParams.has(param)) {
      hashParams.delete(param);
      changed = true;
    }
  }

  if (!changed) return;

  const search = searchParams.toString();
  const hash = hashParams.toString();
  history.replaceState(
    history.state,
    "",
    location.pathname +
      (search ? "?" + search : "") +
      (hash ? "#" + hash : "")
  );
}
