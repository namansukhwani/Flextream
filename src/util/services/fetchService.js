import configration from './../configration';

class FetchService{
    constructor() {
        this._swapFlag = true;
        this._url1 = configration.SERVER_URL_1;
        this._url2 = configration.SERVER_URL_2;
        this._imageUrl = configration.IMAGE_URL;

        this._wakeUpCall();
    }

    call(url, options) {
        if(options)
            return fetch(this._url() + url, options);
        return fetch(this._url()+url);
    }   

    _url() {
        if (this._swapFlag) {
            this._swapFlag = !this._swapFlag;
            return this._url1;
        }
        this._swapFlag = !this._swapFlag;
        return this._url2
    }

    async _wakeUpCall() {
        await Promise.all([
            fetch(this._url1 + "/readiness"),
            fetch(this._url2 + "/readiness"),
            fetch(this._imageUrl+"/readiness")
        ])
    }

    run() {
        return;
    }
}

const fetchAPI = new FetchService();
export default fetchAPI;