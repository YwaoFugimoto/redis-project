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

test("should return correct TTL for a key and error cases", async() => {
    await sendCommand("set fooexp expt");
    const expireResponse = await sendCommand("expire fooexp 5");
    assert.strictEqual(expireResponse, ":1\r\n");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const getResponse = await sendCommand("ttl fooexp");
    const match = getResponse.match(/^:(\d+)\r\n$/);
    const ttlValue = parseInt(match[1]);

    assert.ok(ttlValue <= 3, "Expexted ttlValue to be less than or equal to 3");

    const errorResponse = await sendCommand("ttl");
    assert.strictEqual(errorResponse, "-ERR wrong number of arguments for 'ttl' command\r\n");
});

test("should INCR a key and error cases", async() => {
    await sendCommand("set fooinc 5");

    const response1 = await sendCommand("incr fooinc");
    assert.strictEqual(response1, ":6\r\n");

    const getResponse = await sendCommand("get fooinc");
    assert.strictEqual(getResponse, "$1\r\n6\r\n");

    const response2 = await sendCommand("incr");
    assert.strictEqual(response2, "-ERR wrong number of arguments for 'incr' command\r\n");

    await sendCommand("set fooString bar1");
    const getError = await sendCommand("incr fooString");
    assert.strictEqual(getError, "-ERR value is not an integer or out of range\r\n");
});
