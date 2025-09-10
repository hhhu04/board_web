let navigate = null;

export const setNavigate = (navigateFunction) => {
    navigate = navigateFunction;
};

export const navigateTo = (path) => {
    if (navigate) {
        navigate(path);
    } else {
        console.warn('Navigate function not set, falling back to location.href');
        window.location.href = path;
    }
};