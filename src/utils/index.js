const buildRedisCommand = (input) => {
    const args = input.split(" ");
    let command = `*${args.length}\r\n`;

    args.forEach(key => {
        command += `$${key.length}\r\n${key}\r\n`;
    });

    return command;
}

module.exports = {
    buildRedisCommand,
}