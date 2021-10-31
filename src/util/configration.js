class Configure{
    SERVER_URL_1;
    SERVER_URL_2;
    IMAGE_URL;
    API_URL;
    constructor() {
        if (process.env.REACT_APP_NODE_ENV !== "development") {
            this.SERVER_URL_1 = process.env.REACT_APP_SERVER_URL_1;
            this.SERVER_URL_2 = process.env.REACT_APP_SERVER_URL_2;
        }
        else {
            this.SERVER_URL_1 = process.env.REACT_APP_SERVER_URL_DEVELOPMENT;
            this.SERVER_URL_2 = process.env.REACT_APP_SERVER_URL_DEVELOPMENT;
        }
        this.IMAGE_URL = process.env.REACT_APP_SERVER_URL_DEVELOPMENT;
        this.API_URL = process.env.REACT_APP_API_URL;
    }
}

const configration = new Configure();
export default configration