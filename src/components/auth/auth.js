export const setToken = (token, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem("authToken", token);
    } else {
        sessionStorage.setItem("authToken", token);
    }
};

export const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
};

export const removeToken = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
};

// 同样的方法也可以用于用户名
export const saveUsername = (username, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem("username", username);
    } else {
        sessionStorage.setItem("username", username);
    }
};

export const getUsername = () => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
};

export const removeUsername = () => {
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
};

export const saveUserDetails = (userDetails) => {
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
};

export const getUserDetails = () => {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      return JSON.parse(storedDetails);
    }
};
