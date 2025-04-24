const net = require("net");
const assert = require("node:assert");
const {before, after, test} = require("node:test");
const { buildRedisCommand } = require("../src/utils/index");
const { send } = require("process");

let redisClient;

const connectToRedis = () => {
    return new Promise((resolve, reject) => {
        redisClient = net.createConnection({ port: 6379 }, () => {
            resolve();
        });

        redisClient.on("error", (err) => {
            reject(err);
        });
    });
};

before(async () => {
    await connectToRedis();
});

after(() => {
    if(redisClient && !redisClient.destroyed) {
        redisClient.end();
    };
});

const onError = (err) => {
    reject(err);
}

const sendCommand = (command) => {
    return new Promise((resolve, reject) => {
        if(!redisClient || redisClient.destroyed) {
            reject (new Error ("Client is not connected"));
            return;
        };

        redisClient.write(buildRedisCommand(command));

        redisClient.once("data", (data) => {
            resolve(data.toString());
            redisClient.removeListener("error", onError);
        });

        redisClient.once("error", onError);
    });
};

test("should SET and GET a value", async () => {
    const setResponse = await sendCommand("set foo bar");
    assert.strictEqual(setResponse, "+OK\r\n");
  
    const getResponse = await sendCommand("get foo");
    assert.strictEqual(getResponse, "$3\r\nbar\r\n");
  });

test("should return $-1 for a non-existent key", async () => {
    const getResponse = await sendCommand("get tool");
    assert.strictEqual(getResponse, "$-1\r\n" );
});

test("should delete a key", async() => {
    await sendCommand("set del bar");
    const delResponse = await sendCommand("del del");
    assert.strictEqual(delResponse, ":1\r\n");

    const getResponse = await sendCommand("get del");
    assert.strictEqual(getResponse, "$-1\r\n");
});

test("should expire a key", async() => {
    await sendCommand("set expfoo expbar");
    const expResponse = await sendCommand("expire expfoo 1");
    assert.strictEqual(expResponse, ":1\r\n");

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const getResponse = await sendCommand("get expfoo");
    assert.strictEqual(getResponse, "$-1\r\n");
});

test("should handle unknown commands successfully", async () => {
    const unkResponse = await sendCommand("UNKNOWN foo");
    assert.strictEqual(unkResponse, "-ERR unknow command\r\n");
});

