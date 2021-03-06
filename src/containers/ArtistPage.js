const { Component, h } = require('preact') /** @jsx h */

const entity = require('../entity')
const store = require('../store')
const { getArtist, getAlbum, getTrack } = require('../store-getters')
const { formatInt } = require('../format')

const ArtistList = require('../components/ArtistList')
const AlbumList = require('../components/AlbumList')
const Heading = require('../components/Heading')
const Loader = require('../components/Loader')
const Sheet = require('../components/Sheet')
const TrackList = require('../components/TrackList')

class ArtistPage extends Component {
  componentDidMount () {
    this._load()
  }

  componentWillReceiveProps (nextProps) {
    if (!entity.equal(this.props.entity, nextProps.entity)) this._load()
  }

  _load () {
    const { entity } = store
    store.dispatch('APP_TITLE', entity.name)
    store.dispatch('FETCH_ARTIST_INFO', { name: entity.name })
    store.dispatch('FETCH_ARTIST_TOP_ALBUMS', { name: entity.name, limit: 24 })
    store.dispatch('FETCH_ARTIST_TOP_TRACKS', { name: entity.name, limit: 10 })
  }

  render (props) {
    const { entity } = store
    const artist = getArtist(entity.url)

    if (!artist || !artist.images) {
      return <Sheet><Loader center /></Sheet>
    }

    let $content = <Loader style={{ marginTop: 'calc(35vh - 120px)' }} />

    const topTracks = artist.topTrackUrls.map(getTrack)
    const topAlbums = artist.topAlbumUrls.map(getAlbum)

    if (topTracks.length > 0 && topAlbums.length > 0) {
      let $extra = null

      const similar = artist.similar.map(getArtist)
      const $similarHeading = <Heading class='tc'>Related Artists</Heading>

      const summary = artist.summary && artist.summary.replace(/\n/g, '<br>')
      if (summary) {
        $extra = (
          <div class='cf'>
            <div class='fr w-100 w-50-m w-50-l'>
              {$similarHeading}
              <ArtistList artists={similar} />
            </div>
            <div class='fl w-100 w-50-m w-50-l pl0 pl3-m pl3-l pr0 pr4-m pr4-l'>
              <div class='center lh-copy mw7'>
                <Heading class='tc'>Who is {artist.name}?</Heading>
                <div class='f4 white-80' dangerouslySetInnerHTML={{ __html: summary }} />
              </div>
            </div>
          </div>
        )
      } else {
        $extra = (
          <div>
            {$similarHeading}
            <ArtistList artists={similar} size='small' />
          </div>
        )
      }

      $content = (
        <div>
          <div class='mw7 center'>
            <Heading class='tc'>Popular</Heading>
            <TrackList tracks={topTracks} showArtistName={false} columns={2} />
          </div>
          <div>
            <Heading class='tc'>Albums</Heading>
            <AlbumList albums={topAlbums} showArtistName={false} size='small' />
          </div>
          {$extra}
        </div>
      )
    }

    const coverImage = artist.images[artist.images.length - 1]
    let $listeners = null
    if (artist.listeners) {
      const listeners = formatInt(artist.listeners)
      $listeners = (
        <div class='absolute bottom-2 right-2 mb3 dn dn-m db-l'>
          <div class='f6 mv0 tracked ttu white-80'>{listeners} listeners</div>
        </div>
      )
    }

    return (
      <Sheet>
        <div
          class='artist-page-cover relative cover nl3 nl3-m nl4-l nr3 nr3-m nr4-l nt6 mb3 text-outline shadow-2'
          style={{
            backgroundImage: `url(${coverImage}), linear-gradient(#AAA, #999)`
          }}
        >
          <div class='absolute bottom-2 left-2 w-80'>
            <div class='f6 mv0 tracked ttu'>Artist</div>
            <h1 class='f3 f1-m f-subheadline-l sans-serif mt1 mb0 w-100 truncate'>
              {artist.name}
            </h1>
          </div>
          {$listeners}
        </div>
        {$content}
      </Sheet>
    )
  }
}

module.exports = ArtistPage
