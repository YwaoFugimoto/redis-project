const net = require('net');
const { parseCommand, executeCommand, commandHandlers } = require('./core');
const logger = require('./utils/logger')("server");

const server = net.createServer();
const port = 6379;
const host = "127.0.0.1";

server.on("connection", (socket) => {
    socket.on("data", (data) => {
        let response;
        try{
            const { command, args } = parseCommand(data);
            response = executeCommand(command, args);
        } catch (err) {
            logger.log(err);
            response = "-ERR unknown command\r\n";
        }

        socket.write(response);
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, host, () => {
    // init();

    logger.log(`Server running at ${host} : ${port}`);
});