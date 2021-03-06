module.exports = apiFacts

const debug = require('debug')('play:api-facts')
const sbd = require('sbd')

const config = require('../config')
const entity = require('../src/entity')
const secret = require('../secret')
const SongFacts = require('./songfacts')

const songfacts = new SongFacts(secret.songfacts, config.apiUserAgent)

const LINE_BREAK_REGEX = /<br( \/)?><br( \/)?>/ig

/**
 * Search SongFacts. Returns a collection of facts for the given `track` and
 * `artist` query parameters.
 */
function apiFacts (opts, cb) {
  debug('%o', opts)

  songfacts.getFacts(opts, (err, result) => {
    if (err) return cb(err)

    let { meta, info, facts } = result

    facts = facts
      .map(fact => fact.replace(LINE_BREAK_REGEX, '\n'))
      .map(fact => {
        return sbd.sentences(fact, {
          newline_boundaries: true
        })
      })

    facts = [].concat(...facts)

    // Rewrite <a> tags in facts to point to Play search results
    facts = facts.map(fact => {
      return fact.replace(/href=".*?".*?>([^<]*)<\//g, (match, q) => {
        const url = entity.encode({ type: 'search', q })
        return `href="${url}" class="link dark-red hover-red">${q}</`
      })
    })

    cb(null, { meta, info, facts })
  })
}
