const net = require('net');
const logger = require('./logger')("server");

const server = net.createServer();
const port = 6379;
const host = "127.0.0.1";

server.on("connection", (Socket) => {
    Socket.on("data", (data) => {
        const reqData = data.toString();

        Socket.write("res: " + reqData);
    });

    Socket.on("end", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, host, () => {
    logger.log(`Server running at ${host} : ${port}`);

});