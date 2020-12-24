// console.log("hello!")

// my-code
// Name  : Pranjal Varshney
// Email : pranjal25varshney@gmail.com

const fs = require("fs")
const path = require("path")

const todoTaskFile = path.join("todo.txt")
const doneTodoFile = path.join("done.txt")

const createFiles = () => {
  return [todoTaskFile, doneTodoFile].forEach((file) => {
    if (!fs.existsSync(file)) {
      fs.closeSync(fs.openSync(file, "w"))
    }
  })
}

const displayHelp = () => {
  console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`)
}

const writeTodo = (file, item) => {
  const allTodos = fs.readFileSync(file)
  const newTodo = allTodos + item + "\n"
  fs.writeFileSync(file, newTodo)
  return 0
}

const addTodo = (item, printConsole) => {
  if (!item) {
    console.log("Error: Missing todo string. Nothing added!")
    return 0
  }
  writeTodo(todoTaskFile, item)
  if (!printConsole) {
    console.log(`Added todo: "${item}"`)
  }
  return 0
}

const todosToArr = (file) => {
  let allTodos, allTodosArr, totalTodos
  allTodos = fs.readFileSync(file).toLocaleString()

  allTodosArr = allTodos.split("\n")
  totalTodos = allTodosArr.length - 1

  return [allTodos, allTodosArr, totalTodos]
}

const emptyOutAFile = (file) => {
  fs.truncateSync(file, 0)
}

const listAllTodo = () => {
  let allTodos, allTodosArr, totalTodos, i, allTodosString
  ;[allTodos, allTodosArr, totalTodos] = todosToArr(todoTaskFile)
  if (allTodos == "") {
    console.log("There are no pending todos!")
    return
  }
  allTodosString = ""
  for (i = totalTodos - 1; i >= 0; i--) {
    allTodosString += `[${i + 1}] ${allTodosArr[i]}`
    if (i != 0) {
      allTodosString += "\n"
    }
  }
  console.log(allTodosString)
  return 0
}

const deleteTodo = (number, printConsole) => {
  if (number != 0 && !number) {
    console.log("Error: Missing NUMBER for deleting todo.")
    return
  }
  let allTodosArr, totalTodos, i
  ;[allTodos, allTodosArr, totalTodos] = todosToArr(todoTaskFile)

  if (number < 1 || number > totalTodos) {
    console.log(`Error: todo #${number} does not exist. Nothing deleted.`)
    return 0
  }

  emptyOutAFile(todoTaskFile)

  for (i = 0; i < totalTodos; i++) {
    if (number != i + 1) {
      addTodo(allTodosArr[i], true)
    }
  }

  if (!printConsole) {
    console.log(`Deleted todo #${number}`)
  }
  return allTodosArr[number - 1]
}

const getDate = () => {
  return new Date(Date.now()).toISOString().slice(0, 10)
}

const markTodoDone = (number) => {
  if (number != 0 && !number) {
    console.log("Error: Missing NUMBER for marking todo as done.")
    return 0
  }
  let removedTodo
  removedTodo = deleteTodo(number, true)
  removedTodo = `x ${getDate()} ${removedTodo}`

  writeTodo(doneTodoFile, removedTodo)
  console.log(`Marked todo #${number} as done.`)
  return 0
}

const displayReport = () => {
  let [, , pendingTotal] = todosToArr(todoTaskFile)
  let [, , completedTotal] = todosToArr(doneTodoFile)

  console.log(
    `${getDate()} Pending : ${pendingTotal} Completed : ${completedTotal}`
  )
  return 0
}

createFiles()
const operation = process.argv[2]
const argument = process.argv[3]

switch (operation) {
  case undefined:
  case "help":
    displayHelp()
    break
  case "add":
    addTodo(argument)
    break
  case "ls":
    listAllTodo()
    break
  case "del":
    deleteTodo(argument)
    break
  case "done":
    markTodoDone(argument)
    break
  case "report":
    displayReport()
    break
  default:
    displayHelp()
}
