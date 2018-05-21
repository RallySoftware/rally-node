const qs = require('querystring');
const fetch = require('cross-fetch');
const cookie = require('cookie');
const apiLog = require('debug')('api');
const packageInfo = require('../package.json');

const getAuthToken = async (username="kmitchell@rallydev.com", password="Password", serverURL="https://ueshellrally.testn.f4tech.com") => {
  const response = await fetch(`${serverURL}/login/`, {
    redirect: 'manual',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${qs.escape(username)}&password=${qs.escape(password)}`,
    method: 'POST',
    mode: 'cors',
  });
  const cookies = cookie.parse(response.headers.get('Set-Cookie') || '');
  return cookies.ZSESSIONID;
};


module.exports = class Api {
  constructor({ username, password, serverURL, apiVersion, fetchOptions, sessionCredential}) {
    this.username = username || process.env.RALLY_API_USERNAME;
    this.password = password || process.env.RALLY_API_PASSWORD;
    this.serverURL =  serverURL || process.env.RALLY_API_SERVER_URL;
    this.apiVersion = apiVersion || 'v2.0';
    this.wsapiUrl = `${this.serverURL}/slm/webservice/${this.apiVersion}`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'X-RallyIntegrationLibrary': `${packageInfo.description} v${packageInfo.version}`,
      'X-RallyIntegrationName': packageInfo.description,
      'X-RallyIntegrationVendor': 'Rally Software, Inc.',
      'X-RallyIntegrationVersion': packageInfo.version
    };
    this.fetchOptions = fetchOptions || {};
    this.sessionCredential = sessionCredential;
    this.login();
  }

  async login(force) {
    if (!this.sessionCredential || force) {
      this.sessionCredential = await getAuthToken(this.username, this.password, this.serverURL);
      this.updateCredential();
      apiLog('got login token', this.sessionCredential);
      return this.sessionCredential;
    }
  }

  logout() {
    this.sessionCredential = undefined;
    global.clearInterval(this.updateId);
  }

  updateCredential() {
    if (this.updateId) global.clearInterval(this.updateId);
    this.updateId = setInterval(() => {
      return this.login(true);
    }, 6000000);
  }

  handleResponse(response) {
    return new Promise((resolve, reject) => {
      return response.ok ? resolve(response) : reject(response);
    });
  }

  handleWSAPIErrorFetchResponse(response) {
    apiLog("Error: ", response);
    return Promise.reject(response);
  }

  async createRaw(type, data) {
    return fetch(`${this.wsapiUrl}/${type}/create`, {
      credentials: 'include',
      headers: {
        ...this.defaultHeaders,
        'zsessionid': this.sessionCredential,
      },
      body: JSON.stringify(data),
      method: 'POST',
      mode: 'cors',
      compress: true, // verify this is a thing in browser.
    });
  }

  async create(type, data) {
    return this.createRaw(type, data)
      .then(this.handleResponse)
      .catch(this.handleWSAPIErrorFetchResponse);
  }


  async updateRaw() {

  }

  async update() {

  }

  async deleteRaw() {

  }

  async delete() {

  }

  async search() {

  }

  async searchRaw() {

  }

  async query() {

  }

  async queryRaw() {

  }
}

// fetch("https://ueshellrally.testn.f4tech.com/login/", {
//   redirect: "follow",
//   credentials: "include",
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   body: "username=kmitchell%40rallydev.com&password=Password&client_id=Rally&submit=Sign+in",
//   method: "POST",
//   mode: "cors",
// }).then(res => location.replace('/login/accounts/index.html'));


// // NOTE: Environment variable RALLY_API_KEY (or RALLY_USERNAME and RALLY_PASSWORD)
// // must be defined to actually run this example
// var rally = require('..'),
//   restApi = rally(),
//   refUtils = rally.util.ref;

// function createDefect() {
//   console.log('Creating defect...');
//   return restApi.create({
//     type: 'defect',
//     data: {
//       Name: 'My Defect',
//       Environment: 'Test'
//     }
//   });
// }

// function readDefect(result) {
//   console.log('Defect created:', refUtils.getRelative(result.Object));
//   console.log('Reading defect...');
//   return restApi.get({
//     ref: result.Object,
//     fetch: ['FormattedID', 'Name']
//   });
// }

// function updateDefect(result) {
//   console.log('Defect read:', result.Object.FormattedID, '-', result.Object.Name);
//   console.log('Updating defect...');
//   return restApi.update({
//     ref: result.Object,
//     data: {
//       Name: 'My Updated Defect'
//     },
//     fetch: ['Name']
//   });
// }

// function deleteDefect(result) {
//   console.log('Defect updated:', result.Object.Name);
//   console.log('Deleting defect...');
//   return restApi.del({
//     ref: result.Object
//   });
// }

// function onSuccess(result) {
//   console.log('Success!', result);
// }

// function onError(error) {
//   console.log('Failure!', error.message, error.errors);
// }

// createDefect()
//   .then(readDefect)
//   .then(updateDefect)
//   .then(deleteDefect)
//   .then(onSuccess)
//   .catch(onError);
