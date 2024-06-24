/*
Postinstall Script for sqlite-electron module
Copyright (C) 2022-2024  Motagamwala Taha Arif Ali

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const https = require('https');
const fs = require('fs');
const { resolve, dirname } = require('path')

const extract = require('./dependencies')

if (process.platform === 'win32') {
    const file = fs.createWriteStream(`./sqlite-${process.platform}-${process.arch}.zip`);
    https.get(`https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip`, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", async () => {
                file.close();
                console.log("Download Completed")
                await extract(resolve(`./sqlite-${process.platform}-${process.arch}.zip`), { dir: dirname(resolve(`./sqlite-${process.platform}-${process.arch}.zip`)) })
                console.log("Extraction Completed")
                fs.unlinkSync(resolve(`./sqlite-${process.platform}-${process.arch}.zip`))
            });
        } else if (response.statusCode === 302) {
            https.get(response.headers.location, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on("finish", async () => {
                        file.close();
                        console.log("Download Completed")
                        await extract(resolve(`./sqlite-${process.platform}-${process.arch}.zip`), { dir: dirname(resolve(`./sqlite-${process.platform}-${process.arch}.zip`)) })
                        console.log("Extraction Completed")
                        fs.unlinkSync(resolve(`./sqlite-${process.platform}-${process.arch}.zip`))
                    });
                } else {
                    throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip` }
                }
            })
        } else {
            throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip` }
        }
    }).on("error", (e) => {
        throw e
    })
} else {
    const file = fs.createWriteStream(`./sqlite-${process.platform}-${process.arch}.zip`);
    https.get(`https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip`, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", async () => {
                file.close();
                console.log("Download Completed")
                await extract(resolve(`./sqlite-${process.platform}-${process.arch}.zip`), { dir: dirname(resolve(`./sqlite-${process.platform}-${process.arch}.zip`)) })
                console.log("Extraction Completed")
                fs.unlinkSync(resolve(`./sqlite-${process.platform}-${process.arch}.zip`))
                fs.chmodSync(resolve(`./sqlite-${process.platform}-${process.arch}/sqlite-${process.platform}-${process.arch}`), 0o744)
            });
        } else if (response.statusCode === 302) {
            https.get(response.headers.location, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on("finish", async () => {
                        file.close();
                        console.log("Download Completed")
                        await extract(resolve(`./sqlite-${process.platform}-${process.arch}.zip`), { dir: dirname(resolve(`./sqlite-${process.platform}-${process.arch}.zip`)) })
                        console.log("Extraction Completed")
                        fs.unlinkSync(resolve(`./sqlite-${process.platform}-${process.arch}.zip`))
                        fs.chmodSync(resolve(`./sqlite-${process.platform}-${process.arch}/sqlite-${process.platform}-${process.arch}`), 0o744)
                    });
                } else {
                    throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip` }
                }
            })
        } else {
            throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v3.1.1/sqlite-${process.platform}-${process.arch}.zip` }
        }
    }).on("error", (e) => {
        throw e
    })
}
