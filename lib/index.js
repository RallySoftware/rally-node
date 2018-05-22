const where = require('./util/query').where;
const ref = require('./util/ref');
const FetchApi = require('./fetch');

module.exports = {
  FetchApi: FetchApi,
  query: { where },
  ref
};