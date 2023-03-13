
const dbValidator = require('./db-validators');
const generateJWT = require('./generate-jwt');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidator,
    ...generateJWT,
    ...uploadFile,
}