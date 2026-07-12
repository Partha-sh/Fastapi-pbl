const TOKEN_KEY = "pixshare.token";

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
