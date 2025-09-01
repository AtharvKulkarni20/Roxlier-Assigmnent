export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
}

export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}