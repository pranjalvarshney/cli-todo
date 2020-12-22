// console.log("hello!")

// my-code
const fs = require("fs")
const fileName = "todoDB.json"

// {
//     task: "drink water",
//     status: true
// }

const displayUsage = () => {
  console.log(`Usage :-
    $ ./todo add "todo item"   # Add a new todo
    $ ./todo ls                # Show remaining todos
    $ ./todo del NUMBER        # Delete a todo
    $ ./todo done NUMBER       # Complete a todo
    $ ./todo help              # Show usage
    $ ./todo report            # Statistics
    `)
}

const createDb = () => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, JSON.stringify([]))
  }
}
const readDb = () => {
  const data = fs.readFileSync(fileName)
  return JSON.parse(data)
  //   console.log(JSON.parse(data))
}

const writeDb = (data) => {
  const arr = readDb()
  arr.push({
    task: data,
    status: false,
  })
  fs.writeFileSync(fileName, JSON.stringify(arr))
  console.log(`Added todo: "${data}"`)
}

const analyseData = () => {
  const arr = readDb()
  let count = 0
  arr.map((val) => {
    if (val.status) {
      count++
    }
  })
  console.log(
    `${new Date(Date.now()).toLocaleDateString()} Pending : ${
      arr.length - count
    } Completed : ${count}`
  )
}

const listAllTask = () => {
  const arr = readDb()
  arr.slice(0).reverse().map((item, index) => {
    if(!item.status){
      console.log(`[${arr.length-index}] ${item.task}`)
    }
  })
}

const markTaskDone = (number) => {
  const arr = readDb()
  arr.slice(0).reverse().map((item,index)=>{
    if(index == arr.length-number){
      item.status = true
    }
  })
  fs.writeFileSync(fileName, JSON.stringify(arr))
  console.log(`Marked todo #${number} as done.`)
}

const deleteTask = (number) => {
  const arr = readDb()
  arr.slice(0).reverse().splice(arr.length -number,1)
  fs.writeFileSync(fileName,JSON.stringify(arr))
  console.log(`Deleted todo #${number}`)
}

createDb()
const task = process.argv[2]
const argument = process.argv[3]

switch (task) {
  case "add":
    writeDb(argument)
    break
  case "del":
    deleteTask(argument)
    break
  case "done":
    markTaskDone(argument)
    break
  case "help":
    displayUsage()
    break
  case "report":
    analyseData()
    break
  case "ls":
    listAllTask()
    break
  default:
    displayUsage()
}
