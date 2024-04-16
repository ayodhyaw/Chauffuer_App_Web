export default class CommonStrore {
    token: string | null = null;
    appLoaded = false;

    setToken = (token: string | null) => {
        if (token) window.localStorage.setItem('jwt', token);
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}