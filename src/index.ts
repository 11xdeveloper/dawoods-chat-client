#!/usr/bin/env node

import { io } from "socket.io-client";
import inquirer from "inquirer";
import serverline from "serverline";

const { username }: { username: string } = await inquirer.prompt([
  { name: "username", message: "Enter username: ", type: "input" } as const,
]);

const socket = io("http://amplyfy.grabyourservices.com:8080", {
  reconnectionDelayMax: 10000,
});

socket.connect();

socket.emit("username", username);

socket.on("message", ({ message, username }) => {
  console.log(`${username}: ${message}`);
});

socket.on("log", (message) => {
  console.log(message);
});

process.stdout.write("\x1Bc");

serverline.init();
serverline.setPrompt("> ");

serverline.on("line", (line: string) => {
  socket.emit("message", line);
});
