const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const filePath = 'testcase - Trang tính1.csv';

const readFileCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
const writeFileCSV = (data, filePath) => {
    const csvStream = fs.createWriteStream(filePath, { flags: 'w' });

    csvStream.write('api,method,inputBody,outputCode,check\n');

    data.forEach(item => {
        csvStream.write(`"${item.api}","${item.method}","${item.inputBody}",${item.outputCode},${item.check}\n`);
    });

    csvStream.end();

    console.log(`Data has been written to ${filePath}`);

}
function isObjectEmpty(obj) {
    return JSON.stringify(obj) === '{}';
}

async function fetchData() {
    try {
        let data = await readFileCSV(filePath);
        console.log(data);
        for (const test of data) {
            if(isObjectEmpty(test))
                return;
            console.log(test.api);
            const requestBody = JSON.parse(test.inputBody);
            console.log(test.method);
            let response;
            switch (test.method) {
                case "get":
                    console.log(requestBody);
                    response = await axios.get(test.api,requestBody);
                    console.log("test.outputCode: ",test.outputCode);
                    console.log("response.data.code: ", response.data.code);
                    response.data.code == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "post":
                    console.log(requestBody);
                    response = await axios.post(test.api, requestBody);
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.code == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "delete":
                    console.log(requestBody);
                    response = await axios.post(test.api, requestBody);
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.code == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "patch":
                    console.log(requestBody);
                    response = await axios.post(test.api, requestBody);
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.code == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "put":
                    console.log(requestBody);
                    response = await axios.post(test.api, requestBody);
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.code == test.outputCode ? test.check = true : test.check = false;
                    break;
                default:
                    break;
            }

        }
        // console.log(data);
        writeFileCSV(data, filePath)
    } catch (error) {
        console.log(error);
        if (error.response) {
            // The request was made, but the server responded with a status code that falls out of the range of 2xx
            console.error('Response Error Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        console.log("can't connect server");

    }
}

fetchData();