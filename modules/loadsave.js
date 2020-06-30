const fs = require('fs')

const config = {
  savefile: 'saves/savefile.json'
}

/**
 *
 */
async function loadState () {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(config.savefile)) {
      console.log('no save file exists')
      fs.writeFileSync(
        config.savefile,
        JSON.stringify({ events: [{ t: new Date().getTime() }] })
      )
    }
    fs.readFile(config.savefile, function (err, data) {
      if (err) {
        return reject(new Error(err))
      }
      resolve(JSON.parse(data.toString()))
    })
  })
}

/**
 *
 */

async function saveState (state) {
  fs.writeFileSync(config.savefile, JSON.stringify(state))
}

module.exports = { loadState, saveState }
