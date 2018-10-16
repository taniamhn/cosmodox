const storageKey = 'userAuthenticated';

const login = (element) => {
  localStorage.setItem(storageKey, true);
  element.dispatchEvent(new CustomEvent('authentication-change', {
    bubbles: true,
    composed: true,
    detail: { status: true },
  }));
};

const logout = (element) => {
  localStorage.removeItem(storageKey);
  element.dispatchEvent(new CustomEvent('authentication-change', {
    bubbles: true,
    composed: true,
    detail: { status: false },
  }));
};

const checkAuth = () => !!localStorage.getItem(storageKey);

export { login, logout, checkAuth };
