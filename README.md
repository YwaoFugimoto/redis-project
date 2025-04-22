<h1 align="center">
  Redis‑js
  <img src="image/redis1.png" alt="logo" width="40" style="vertical-align:middle;" />
</h1>



A lightweight, in-memory key-value data store, implemented in JavaScript for educational and prototyping purposes.

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