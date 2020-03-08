import { cli, run } from "secretlint/lib/cli";
// workaround https://github.com/nexe/nexe/issues/711
import fs from "fs";
import path from "path";

async function fsReaddir(dpath: string, opts: any = {}) {
    const dirList: string[] = await new Promise((resolve, reject) => {
        fs.readdir(dpath, (err, contents) => {
            if (err) {
                reject(err);
            } else {
                resolve(contents);
            }
        });
    });

    if (opts.withFileTypes) {
        const dirents = dirList.map(entName => {
            return new Promise((resolve, reject) => {
                fs.stat(path.join(dpath, entName), (err, statObj) => {
                    if (err) {
                        reject(err);
                    } else {
                        // append name to stats object to behave like a dirent object
                        resolve({
                            name: entName,
                            ...statObj
                        });
                    }
                });
            });
        });

        return Promise.all(dirents);
    }

    return dirList;
}

fs.readdir = fsReaddir as any;
// Entry Point
run(cli.input, cli.flags).then(
    ({ exitStatus, stderr, stdout }) => {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.error(stderr);
        }
        process.exit(exitStatus);
    },
    error => {
        console.error(error);
        process.exit(1);
    }
);
