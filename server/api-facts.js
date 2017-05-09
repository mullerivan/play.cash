module.exports = apiFacts

const debug = require('debug')('play:api-facts')
const sbd = require('sbd')

const config = require('../config')
const secret = require('../secret')
const SongFacts = require('./songfacts-scrape')

const songfacts = new SongFacts(secret.songfacts, config.apiUserAgent)

/**
 * Search SongFacts. Returns a collection of facts for the given `track` and
 * `artist` query parameters.
 */
function apiFacts (opts, cb) {
  debug('%o', opts)

  cb(null, [])
  // songfacts.getFacts(opts, (err, facts) => {
  //   if (err) return cb(err)
  //   facts = facts.map(fact => sbd.sentences(fact))
  //   facts = [].concat(...facts)
  //   cb(null, facts)
  // })
}
