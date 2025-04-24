<div align="center"><img src="image/redis-js.png"></img></div>
<hr>

A lightweight, in-memory key–value data store based on Redis, implemented in JavaScript for educational and prototyping purposes.

## Overview

`redis-js` simulates core Redis functionality by keeping data in memory and supporting basic commands to store, retrieve, and manage key-value pairs. This project is ideal for learning how Redis works under the hood or for quick prototypes that require simple, temporary data storage without external dependencies.

## Installation

```bash
# Clone the repository
git clone https://github.com/YwaoFugimoto/redis-project.git
cd redis-project

# (No dependencies by default)
npm install

# Start the server
node src/server.js
```

The server will listen on `127.0.0.1:6379`.

## Configuration 

Control persistence and behavior via src/config.json:
```bash
{
  "snapshot": false,
  "snapshotInterval": 10000,
  "appendonly": true,
  "aofCommands": [
    "SET",
    "DEL",
    "EXPIRE",
    "INCR",
    "DECR",
    "LPUSH",
    "RPUSH",
    "LPOP",
    "RPOP"
  ]
}
```

- `snapshot`: enable periodic RDB-style snapshot saves.

- `snapshotInterval`: interval (ms) between snapshots.

- `appendonly`: enable AOF (Append-Only File) logging.

- `aofCommands`: list of commands recorded in AOF.

## Usage

Connect with any Redis client (e.g. `redis-cli`) or telnet:

```bash 
# Using redis-cli
redis-cli -p 6379

# Or with telnet (RESP framing required)
telnet 127.0.0.1 6379
```

Once connected, try:

```bash
> SET foo bar
OK
> GET foo
bar
> INCR counter
:1
> EXPIRE foo 10
:1
> TTL foo
:9
```

## Supported Commands

| Command                       | Description                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `SET <key> <value>`           | Store a string value under key                                                        |
| `GET <key>`                   | Retrieve the string at key, or bulk-nil (`$-1`) if missing or expired                  |
| `DEL <key>`                   | Delete key, returning `:1` if removed or `:0` if not present                          |
| `EXPIRE <key> <seconds>`      | Set a TTL on key, returning `:1` if successful or `:0` if key does not exist           |
| `TTL <key>`                   | Get remaining TTL in seconds: `:-2` (no key), `:-1` (no expiration) or `:<n>`          |
| `INCR <key>`                  | Increment integer at key (initializes to 1 if missing)                                |
| `DECR <key>`                  | Decrement integer at key (initializes to -1 if missing)                               |
| `LPUSH <key> <val> [val…]`    | Prepend one or more values to list at key                                             |
| `RPUSH <key> <val> [val…]`    | Append one or more values to list at key                                              |
| `LPOP <key>`                  | Pop and return first element of list                                                  |
| `RPOP <key>`                  | Pop and return last element of list                                                   |
| `LRANGE <key> <start> <stop>` | Return list elements between `start` and `stop`                                        |
| `FLUSHALL`                    | Remove all keys from the database                                                     |
| `COMMAND`                     | Minimal stub for client metadata and autocomplete requests                            |

## Persistence
Implemented in `src/persistence.js`:
- Snapshot mode: saves periodic JSON dump to `data.rdb`.

- AOF mode: appends commands to `data.aof` and replays them on startup.

- Behavior toggled via `config.json`.

## Testing

Integration tests live in test/server.test.js and use Node’s built-in test runner:

```bash 
# Run the test file directly
node test/server.test.js
```
All tests should pass, covering commands and error cases.


  

