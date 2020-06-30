const { loadState, saveState } = require('./modules/loadsave.js')
const program = require('commander')
const { differenceInSeconds } = require('date-fns')
const chalk = require('chalk')
const nodes = [{ x: 0, y: 0, id: 'base', nodelets: [{ power: 1 }] }]

const BUILDINGS = [
  { shortcut: 'L', name: 'lab', label: 'laboratory', price: 200 }
]

const locations = [
  {
    name: 'w1',
    buildingSlots: [
      { id: 1, building: false },
      { id: 2, building: false }
    ]
  }
]

program
  .option('-d|--debug', 'output extra debugging')
  .option('-s, --status', 'check status')
  .option('-b, --build [something]', 'build')
  .option('-c, --cultivate', 'cultivate')
// .option('-c, --cheese [type]', 'add the specified type of cheese')

async function run () {
  program.parse(process.argv)

  const now = new Date()
  const state = await loadState()
  const lastEvent = state.events[state.events.length - 1]
  const timeSinceLastRun = differenceInSeconds(now, new Date(lastEvent.t))

  // Update
  let power = lastEvent.power || 1
  power += timeSinceLastRun * 0.01

  power = Math.floor((power + Number.EPSILON) * 100) / 100
  state.events.push({ t: new Date().getTime(), power, nodes })
  saveState(state)

  if (program.build) {
    if (program.build === true) {
      return listBuildings()
    }
    const building = BUILDINGS.find(b =>
      [b.shortcut, b.name, b.label].includes(program.build.toUpperCase())
    )
    if (!building) {
      return listBuildings()
    }
    build(building)
  }

  if (program.status) {
    console.log('time since last run', timeSinceLastRun)
    console.log('current power', power)
    // const base = nodes.find
  }
}

run()

function listBuildings () {
  for (let b of BUILDINGS) {
    console.log(chalk.yellow(b.shortcut.toUpperCase()), ' - ', b.label)
  }
}

function build (building) {
  console.log('building...', building)
}
