<div align="center"><img src="image/redis-js.png"></img></div>
<hr>

A lightweight, in-memory key–value data store based on Redis, implemented in JavaScript for educational and prototyping purposes.

## Overview

`redis-js` simulates core Redis functionality by keeping data in memory and supporting basic commands to store, retrieve, and manage key-value pairs. This project is ideal for learning how Redis works under the hood or for quick prototypes that require simple, temporary data storage without external dependencies.

## Features

- **SET <key> <value>**: Store a string value under the specified key.  
- **GET <key>**: Retrieve the string value associated with a key, or `null` if the key does not exist or has expired.  
- **DEL <key>**: Remove a key-value pair, returning `1` if the key was removed or `0` if it did not exist.  
- **EXPIRE <key> <seconds>**: Set a time-to-live (TTL) on a key. After the TTL expires, the key is automatically deleted.  
- **TTL <key>**: Display the remaining time-to-live for a key in seconds, or:  
  - `-2` if the key does not exist.  
  - `-1` if the key exists but has no expiration.

## Installation

```bash
# Clone the repository
git clone https://github.com/YwaoFugimoto/redis-project.git
cd redis-project

# (No dependencies by default)
npm install

# Start the server
npm start  
```

The server will listen on `127.0.0.1:6379`.

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

> PING
+OK
```

## Supported Commands

| Command            | Description                                                                 |
| :----------------- | :-------------------------------------------------------------------------- |
| `SET <key> <value>`| Store a string `<value>` under the key `<key>`                              |
| `GET <key>`        | Retrieve the string stored at `<key>`, or bulk‑nil (`$-1`) if it doesn't exist |
| `DEL <key>`        | Remove the key `<key>`, returning `1` if deleted or `0` if it didn’t exist   |
| `EXPIRE <key> <s>` | Set a time-to-live (TTL) of `<s>` seconds on `<key>`, returns `1` if OK      |
| `TTL <key>`        | Show remaining TTL in seconds, `-2` if not exist, `-1` if no expiration      |
| `COMMAND`          | Minimal stub to satisfy clients’ metadata requests                          |



## Testing

A simple integration test is included in `server.test.js` using Node’s built‑in test runner:

```bash 
# Run the test file directly
node server.test.js
```
You should see no assertion failures if `SET` and `GET` work as expected.

## Project Structure

- **redis-project/**
  - `core.js` &mdash; RESP parser & command dispatch  
  - `server.js` &mdash; TCP server (net.Server) on port 6379  
  - `logger.js` &mdash; Simple namespaced logger  
  - `server.test.js` &mdash; Basic SET/GET integration tests  
  - `package.json`  
  - `README.md`

  

