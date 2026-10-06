const dns = require('node:dns');
const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

const connectDb = async () => {
  try {
    // Custom resolvers avoid SRV lookup failures on some ISP/router DNS servers
    dns.setServers(config.db.dnsServers);
    const connect = await mongoose.connect(config.db.uri);
    logger.info(`Database connected: ${connect.connection.host}/${connect.connection.name}`);
  } catch (err) {
    logger.error('Database connection error', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

module.exports = connectDb;
