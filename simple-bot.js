const mineflayer= require('mineflayer');

if (process.argv.length<4 || process.argv.length>6) {
    console.log("Usage: node simple-bot.js <host> <port> [<name>]");
    process.exit(1);
}

const botArgs = {
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4],
    version: "1.8.9"
};

const initBot = () => {
    
    const bot = mineflayer.createBot(botArgs);

    bot.once('login', async() => {
        let botSocket = bot._client.socket;
        console.log(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}` + " as " + process.argv[4]);
    });

    bot.on('end', () => {
        console.log(`Bot Disconnected`);
        setTimeout(initBot, 5000);
    });

    bot.once('spawn', async() => {
        bot.chat('/register 123321')
        console.log('Registered');
        await bot.waitForTicks(50);
        bot.chat('/login 123321')
        console.log("logged in")
        await bot.waitForTicks(50);
        bot.chat('/server skyblock')
        console.log('Spawned in skyblock');
        await bot.waitForTicks(50);
    });

    setInterval(function() {
        bot.chat('/server skyblock')
    }, 120 * 1000);

    bot.on('message', (message) => {
        console.log(message.toAnsi())
      })

    bot.on('death', () => {
        bot.chat('I died x.x')
        console.log('I died x.x')
    })

    bot.on('kicked', (reason) => {
        console.log(`I got kicked for ${reason}`)
    })

    bot.on('whisper', (username, message, rawMessage) => {
        console.log(`I received a message from ${username}: ${message}`)
        bot.whisper(username, 'I can tell secrets too.')
      })

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Failed to connect to ${err.address}:${err.port}`)
        }
        else {
            console.log(`Unhandled error: ${err}`);
        }
    });

    process.stdin.on('data', (data) => {
        bot.chat(data.toString().trim());
    }
    );
};

initBot();