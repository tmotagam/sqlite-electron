const fs = require('fs');
const { resolve, dirname } = require('path');
const extract = require('./dependencies');

const platform_arch_identifier = process.env.SQEL_PLATFORM_ARCH_IDENTIFIER || `${process.platform}-${process.arch}`;
const url = `https://github.com/tmotagam/sqlite-electron/releases/download/v3.9.12/sqlite-${platform_arch_identifier}.zip`;
const zipPath = resolve(`./sqlite-${platform_arch_identifier}.zip`);

async function main() {
    try {
        console.log(`Downloading sqlite binary for ${platform_arch_identifier}...`);
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Failed to download: ${res.status} ${res.statusText} from ${url}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        fs.writeFileSync(zipPath, Buffer.from(arrayBuffer));

        console.log("Download Completed");
        await extract(zipPath, { dir: dirname(zipPath) });
        console.log("Extraction Completed");

        fs.unlinkSync(zipPath);
    } catch (e) {
        console.error(e);
        if (fs.existsSync(zipPath)) {
            try {
                fs.unlinkSync(zipPath);
            } catch (cleanupErr) { }
        }
        process.exit(1);
    }
}

main();