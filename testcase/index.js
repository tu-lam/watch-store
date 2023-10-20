const axios = require('axios');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const filePath = 'testcase - Trang tính1.csv';
const fileTestFE = 'testcase - FE.csv';

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

    csvStream.write('api,description,method,inputBody,outputCode,check\n');

    const nonEmptyData = data.filter(item => Object.keys(item).length > 0);

    nonEmptyData.forEach(item => {
        csvStream.write(`"${item.api}","${item.description}","${item.method}","${item.inputBody.replace(/"/g, '""')}","${item.outputCode}",${item.check}\n`);
    });

    csvStream.end();

    console.log(`Data has been written to ${filePath}`);

}
function isObjectEmpty(obj) {

    return JSON.stringify(obj) === '{}';
}
function deleteFilesInFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Không thể đọc thư mục:', err);
            return;
        }

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Không thể xóa tệp:', err);
                } else {
                    console.log(`Đã xóa tệp: ${filePath}`);
                }
            });
        }
    });
}

async function fetchData() {
    try {
        let data = await readFileCSV(filePath);
        console.log(data);
        for (const test of data) {
            if (isObjectEmpty(test))
                return;
            console.log(test.api);
            const requestBody = JSON.parse(test.inputBody);
            console.log(test.method);
            let response;
            switch (test.method) {
                case "get":
                    console.log(requestBody);
                    try {
                        response = await axios.get(test.api, requestBody);
                    } catch (error) {
                        console.log(error.response.data.messageCode);
                        error.response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data.code: ", response.data.messageCode);
                    console.log(response.data.messageCode == test.outputCode);
                    response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "post":
                    console.log(requestBody);
                    try {
                        response = await axios.post(test.api, requestBody);
                    } catch (error) {
                        console.log(error.response.data.messageCode);
                        error.response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data.messageCode);
                    console.log(response.data.messageCode == test.outputCode);
                    response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "delete":
                    console.log(requestBody);
                    try {
                        response = await axios.delete(test.api, requestBody);
                    } catch (error) {
                        test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "patch":
                    console.log(requestBody);
                    try {
                        response = await axios.patch(test.api, requestBody);
                    } catch (error) {
                        test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data.code);
                    response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "put":
                    console.log(requestBody);
                    try {
                        response = await axios.put(test.api, requestBody);
                    } catch (error) {
                        test.check = false;
                        break;
                    }
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

async function testCaseFE() {
    let data = await readFileCSV(fileTestFE);
    console.log(data);
    let count = 0;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    for (const test of data) {
        if (isObjectEmpty(test)) {
            writeFileCSV(data, fileTestFE);
            await browser.close();
            return;
        }
        console.log(test.api);
        const requestBody = JSON.parse(test.inputBody);
        console.log(test.method);
        try {
            await page.goto(test.api);
            switch (test.method) {
                case 'login':
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    const fileImage = 'photo-test/U' + count + '.png';
                    await page.screenshot({ path: fileImage, fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'signup':
                    await page.type('input[id="name"]', requestBody.name);
                    await page.type('input[id="email"]', requestBody.email);
                    await page.type('input[id="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProduct':
                    await page.type('');
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showProduct':
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showProductDetail':
                    const elements = await page.$$('.group');
                    await elements[Math.floor(Math.random() * elements.length)].click();
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProductCartNotLogin':
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProductCartHaveLogin':
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.goto(requestBody.URLAddProductCart);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    break;
                default:
                    break;
            }

        } catch (error) {
            console.log('U' + count);
            console.log(error);

            await page.screenshot({ path: 'photo-test/U' + count + '-error' + '.png' });
        }
        count++;
    }
    writeFileCSV(data, fileTestFE);
    await browser.close();
}
// fetchData();
testCaseFE();
deleteFilesInFolder('photo-test/');