const fs = require("fs");
const { Command } = require("commander");
const program = new Command();
const path = require("path");
const Table = require("cli-table3");



const jsonfile = path.join(__dirname, "rohit.json");
let c = 1;

// ✅ Read file safely
const readfile = () => {
    try {
        let data = fs.readFileSync(jsonfile, "utf-8");
        let parsed = JSON.parse(data || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
};

// ✅ Write file
const writefile = (abc) => {
    fs.writeFileSync(jsonfile, JSON.stringify(abc, null, 2), "utf-8");
};

// ✅ Initialize counter from JSON
const initCounter = () => {
    let todos = readfile();
    if (todos.length === 0) {
        c = 1;
    } else {
        let lastTask = todos[todos.length - 1];
        let num = parseInt(lastTask.Sno.split("-")[1]);
        c = num + 1;
    }
};
initCounter();

// ---------------- Commands ----------------

program
    .command("list")
    .action(() => {
            let todos = readfile();
            if (todos.length === 0) {
            console.log("☠️    ☠️      No todos found!");
            return;
            }
            const table = new Table({
            head: ["Sno", "Task", "Time", "Status"],
            colWidths: [10, 50, 15, 15]
            });
            todos.forEach(t => {
            table.push([t.Sno, t.task, t.time, t.status]);
            });
            console.log(table.toString());
        });


program
    .command("add")
    .description("Add a todo")
    .argument("<title>", "Title of the task")
    .argument("<time>", "Time for the task")
    .action((addtodo, todotime) => {
        const todos = readfile();
        const addition = {
            Sno: `task-${c}`,
            task: addtodo,
            time: todotime,
            status: "Not Done"
        };
        todos.push(addition);
        writefile(todos);
        c++; // increment only on add
        console.log("✅ To-Do successfully added!");
    });

program
    .command("remove")
    .description("Remove a todo by Sno")
    .argument("<Sno>", "Sno of the todo to remove (e.g. task-1)")
    .action((Sno) => {
        let todos = readfile();
        let remove = todos.filter((todo) => todo.Sno !== Sno);

        if (remove.length === todos.length) {
            console.log("❌ Todo not found!");
        } else {
            writefile(remove);
            console.log("🗑️ To-Do successfully removed!");
        }
    });

program
    .command("deleteall")
    .description("Delete all todos")
    .action(() => {
        writefile([]);
        console.log("⚠️ All todos deleted!");
    });

program
    .command("mark")
    .description("Mark a todo as done by title")
    .argument("<task-no.>", "Task Number of the todo to mark")
    .action((status) => {
        let todos = readfile();
        let foundit = false;
        todos = todos.map((todo) => {
            if (todo.Sno === status) {
                todo.status = "Done";
                foundit = true;
            }
            return todo;
        });
        if (foundit) {
            writefile(todos);
            console.log("🎉 Good job! Task marked as Done.");
        } else {
            console.log("❌ Todo not found!");
        }
    });

program.parse();
