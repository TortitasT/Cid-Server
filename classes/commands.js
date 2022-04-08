const Chalk = require("chalk");

module.exports = function input(command, configs) {
  switch (command) {
    case "exit":
    case "quit":
      process.exit();
      break;
    case "status":
      console.log(`\n`);
      console.log(Chalk.green(`Server running on port: ${configs.port}`));
      console.log(Chalk.blue(`Players (${configs.players.length}):`));
      console.log(`\n`);
      for (let i = 0; i < configs.players.length; i++) {
        console.log(`id: ${configs.players[i].id}`);
        console.log(`name: ${configs.players[i].character.name}`);
        console.log(`level: ${configs.players[i].character.level}`);
        console.log(
          `pos: ${configs.players[i].pos.x}, ${configs.players[i].pos.y}`
        );
        console.log(`\n`);
      }
      break;
    case "help":
      console.log(`\n`);
      console.log("Commands available:");
      console.log("- help");
      console.log("- quit or exit");
      console.log("- status");
      console.log("- log");
      console.log("- clear");
      console.log(`\n`);
      break;
    case "log":
      console.log(`\n`);
      console.log(configs.log);
      console.log(Chalk.blue("End of log"));
      break;
    case "clear":
      console.clear();
  }
};
