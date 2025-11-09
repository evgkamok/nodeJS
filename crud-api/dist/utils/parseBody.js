"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = parseBody;
function parseBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });
        req.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                const bodyString = buffer.toString('utf-8');
                const parsed = JSON.parse(bodyString);
                resolve(parsed);
            }
            catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', error => {
            reject(error);
        });
    });
}
