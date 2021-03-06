const REDIS_URL = 'redis://localhost:6379'; // it is default url

const asyncRedis = require('async-redis');
const client = asyncRedis.createClient(REDIS_URL);

client.on('error', err => console.log(`Error ${err}`));

const USER_MAP_ADDRESS_PASSWORD = 'user:map:address-password:string';
const USER_LIST_ADDRESS = 'user:list:address-password:string';
const USER_LIST_ADDRESS_XMR = 'user:list:address-xmr:object';
const VPN_LIST = 'vpn:list';

const setVpnUrls = async (urlsList) => {
    await client.del(VPN_LIST);
    urlsList.forEach(async data=>{
        await client.lpush(VPN_LIST, JSON.stringify(data));
    })
};

const getBalanceTable = (address) =>{
    return `hincrby:monero:workers:${address}:balance`
}

const checkIfUserExists = async (req, res, next) => {
    const address = req.params.address;
    if (!(await client.hget(USER_MAP_ADDRESS_PASSWORD, address))) {
        res.status(404).send({message: 'User with such address does not exist.'})
    } else {
        next();
    }
}

module.exports = client;
module.exports.redis = client;
module.exports.getBalanceTable = getBalanceTable;
module.exports.REDIS_URL = REDIS_URL;
module.exports.checkIfUserExists = checkIfUserExists;
module.exports.setVpnUrls = setVpnUrls;
module.exports.VPN_LIST = VPN_LIST;
module.exports.USER_LIST_ADDRESS = USER_LIST_ADDRESS;
module.exports.USER_MAP_ADDRESS_PASSWORD = USER_MAP_ADDRESS_PASSWORD;
module.exports.USER_LIST_ADDRESS_XMR = USER_LIST_ADDRESS_XMR;

