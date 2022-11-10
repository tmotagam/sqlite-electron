/*
Postinstall Script for sqlite-electron module
Copyright (C) 2022-2023  Motagamwala Taha Arif Ali

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

if (process.platform === 'win32') {
    const file = fs.createWriteStream(`./sqlite-${process.platform}-${process.arch}.exe`);
    https.get(`https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}.exe`, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log("Download Completed")
            });
        } else if (response.statusCode === 302) {
            https.get(response.headers.location, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on("finish", () => {
                        file.close();
                        console.log("Download Completed")
                    });
                } else {
                    throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}.exe` }
                }
            })
        } else {
            throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}.exe` }
        }
    }).on("error", (e) => {
        throw e
    })
} else {
    const file = fs.createWriteStream(`./sqlite-${process.platform}-${process.arch}`, { mode: 0o744 });
    https.get(`https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}`, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log("Download Completed")
            });
        } else if (response.statusCode === 302) {
            https.get(response.headers.location, (response) => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                    file.on("finish", () => {
                        file.close();
                        console.log("Download Completed")
                    });
                } else {
                    throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}` }
                }
            })
        } else {
            throw { code: response.statusCode, message: response.statusMessage, url: `https://github.com/tmotagam/sqlite-electron/releases/download/v2.2.5/sqlite-${process.platform}-${process.arch}` }
        }
    }).on("error", (e) => {
        throw e
    })
}
