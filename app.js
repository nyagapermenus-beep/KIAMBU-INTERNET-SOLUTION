function logoutUser() {
    // 1. Clear session indicators from browser storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    sessionStorage.clear(); // Clears any temporary session data
    
    // 2. Clear any active messages on screen
    const messageEl = document.getElementById("page-message");
    if (messageEl) {
        messageEl.textContent = "Logging out...";
        messageEl.style.color = "#ff3333";
    }

    // 3. Redirect back to your login interface page after a tiny delay
    setTimeout(() => {
        window.location.href = "index.html"; // Change to "login.html" if that is your login file name
    }, 400);
}
