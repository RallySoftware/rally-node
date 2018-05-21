const FetchAPI = require('./fetch');

const run = () => {
  const fetchConfig = {
    username: "kmitchell@rallydev.com",
    password: "Password",
    serverURL: "https://ueshellrally.testn.f4tech.com",
  }
  const fetchApi = new FetchAPI(fetchConfig);
  console.log(fetchApi);
}

run();