export class Request {
    constructor() {
        this.body = {}
        this.sufix = ''
        this.url = `${window.location.protocol}//${window.location.host}`
        this.method = 'GET'

        this.controller = new AbortController()
        this.timeoutId = setTimeout(() => this.controller.abort(), 5000)
    }
    setBody(body) { this.body = body; return this }
    setSufix(sufix) { this.sufix = sufix; return this }
    setUrl(url) { this.url = url; return this }
    setMethod(method) { this.method = method; return this }
    async send(){
        const requestUrl = `${this.url}${this.sufix}`;

        const requestOptions = {
            method: this.method,
            headers: { 'Content-Type': 'application/json' },
            signal: this.controller.signal,
        };

        if (this.method !== 'GET' && Object.keys(this.body).length > 0) {
            requestOptions.body = JSON.stringify(this.body);
        }

        try{
            const response = await fetch(requestUrl, requestOptions)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json() 
        }
        catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            } else {
                console.error(error)
            }
        }
        finally {
            clearTimeout(this.timeoutId);
        }
    }
}