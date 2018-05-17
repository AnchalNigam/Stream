//Modules needed
const fs = require('fs')
let readline = require('readline');

//end

let r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let copyDir = () => {

    let allDirFiles = [];

    let getAndReadDirFiles = (dirName) => {
        return new Promise((resolve, reject) => {

            r.question('Please Give me your Source Directory!', (dir) => {

                fs.readdir(dir, (err, file) => {
                    if (err) {
                        reject(`No Such Directory!`);
                    }
                    else if (file.length == 0) {
                        reject(`Source Folder is empty!`);
                    }
                    else {
                        for (let j in file) {

                            console.log("Serial Number " + (parseInt(j) + 1) + " : " + file[j]);
                        }
                        let data = {
                            "sourceDirName": dir,
                            "sourceDirFiles": file
                        }
                        resolve(data);
                    }
                });


            });


        });//promise end
    }

    let getFileAndDestDir = (data) => {
        return new Promise((resolve, reject) => {

            r.question('Please Give Serial Number of File that you want to Copy!', (fileNum) => {

                if (fileNum <= data.sourceDirFiles.length) {
                    r.question('Please Provide Destination Directory!', (dirName) => {

                        fs.readdir(dirName, (err, file) => {
                            if (err) {
                                reject(`No such File or directory of your destination`);
                            }
                            else {
                                data.fileNumber = fileNum;
                                data.destDirName = dirName;
                                resolve(data);
                            }

                        });


                    });  //destination folder input
                   
                }
                else {
                   
                    reject(`Wrong File Serial Number`);

                }

            }); //serial number input

        });//prommise end
    }//end

    let copyingFile = (data) => {


        return new Promise((resolve, reject) => {
            let fileName = data.sourceDirFiles[data.fileNumber - 1];
            let readStream = fs.createReadStream(data.sourceDirName + '/' + fileName);
            let writeStream = fs.createWriteStream(data.destDirName + '/' + fileName);
         
            readStream.on('data', (chunk) => {
                writeStream.write(chunk)
               
                resolve(chunk.toString());
            })
            readStream.on('end', () => {
                writeStream.end();
                console.log('File Read Complete')


            })


        });

    }//end

    getAndReadDirFiles()
        .then(getFileAndDestDir)
        .then(copyingFile)
        .then((resolve) => {
            console.log(resolve);

            process.exit();
        })
        .catch((error) => {
            console.log(error);
            process.exit();
        });

}//end



module.exports = {
    copyDir: copyDir

} 