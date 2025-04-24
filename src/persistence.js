const fs = require("fs");
const fsp = fs.promises;
const path = require("path")

const logger = require("./utils/logger")("persistence");

class Persistence {
    DATA_FILE = path.join(__dirname, "data.rdb");

    constructor() {
        this.store = {};
        this.expirationTime = {};
    };

    async saveSnapshot() {
        const data = JSON.stringify({
            store: this.store,
            expirationTime: this.expirationTime,
        });
        
        try {
            await fsp.writeFile(this.DATA_FILE, data);
            logger.info(`Saves datastore to file: ${this.DATA_FILE}`);
        } catch (error) {
            logger.error(`Failed to save datastore: ${error.message}`);
        };
    };

    loadSnapshotSync() {
        if (!fs.existsSync(this.DATA_FILE)) return;

        try{
            const data = fs.readFileSync(this.DATA_FILE).toString();

            if (data) {
                const { store: loadedStore, expirationTime: loadedExpirationTime } = 
                    JSON.parse(data);

                Object.assign(this.store, loadedStore);
                Object.assign(this.expirationTime, loadedExpirationTime);

                logger.info("Datarstore loaded successfully");                 
            };
        } catch (error) {
            logger.error(`Failed to load datastore: ${error.message}`);
        };
    };
};

module.exports = new Persistence();