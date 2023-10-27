const axios = require('axios');
const FormData = require('form-data');
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
const checkType = (type, input) => {
    switch (type) {
        case 'List':
            return Array.isArray(input);
        case 'Number':
            return typeof input === 'number';
        case 'String':
            return typeof input === 'string';
        case 'Boolean':
            return typeof input === 'boolean';
        case 'Object':
            return (typeof input === 'object' && !Array.isArray(input) && input !== null);
        case 'Null':
            return input === ''
        default:
            return "is not a recognized type";
    }
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
                case "getProduct":
                    console.log(requestBody);
                    try {
                        response = await axios.get(test.api, requestBody);
                    } catch (error) {
                        test.check = false;
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log(checkType(test.outputCode, response.data));
                    test.check = checkType(test.outputCode, response.data);
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
                case "post-formData":
                    console.log(requestBody);
                    let formData = new FormData();
                    formData.append('name', requestBody.name);
                    formData.append('price', requestBody.price);
                    if (requestBody.image) {
                        const fileImage = path.resolve('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                        formData.append('image', fs.createReadStream(fileImage));
                    } else {
                        formData.append('image', '');
                    }

                    try {
                        response = await axios.post(test.api, formData, {
                            headers: {
                                ...formData.getHeaders(),
                            },
                        });
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data.messageCode);
                        console.log(error.response.data.messageCode == test.outputCode);
                        error.response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data.messageCode);
                    console.log(response.data.messageCode == test.outputCode);
                    response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
                    if (test.check) {
                        await axios.delete('http://localhost:4000/products/' + response.data.data.product.id);
                    }
                    break;

                case "delete":
                    console.log(requestBody);
                    try {
                        response = await axios.delete(test.api, requestBody);
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data.code);
                        if (!error.response.data.code) {
                            test.check = false;
                        }
                        error.response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
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
                        console.log(test.outputCode);
                        console.log(error.response.data.code);
                        error.response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
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
                        console.log(test.outputCode);
                        console.log(response.data.code);
                        response.data.messageCode == test.outputCode ? test.check = true : test.check = false;
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
    const browser = await puppeteer.launch({ headless: true, args: ['--start-maximized'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 2560, height: 1600 });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    for (const test of data) {
        if (isObjectEmpty(test)) {
            writeFileCSV(data, fileTestFE);
            await browser.close();
            return;
        }
        await page.goto('http://localhost:3000/dang-xuat');
        await page.waitForTimeout(200);
        console.log(test.api);
        const requestBody = JSON.parse(test.inputBody);
        console.log(test.method);
        let elements;
        try {
            await page.goto(test.api);
            switch (test.method) {
                case 'login':
                    await page.waitForSelector('input[type="email"]');
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
                case 'showProduct':
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showProductDetail':
                    elements = await page.$$('.group');
                    await elements[Math.floor(Math.random() * elements.length)].click();
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showCartNotLogin':
                    await page.waitForTimeout(500);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showCartHaveLogin':
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    await page.click('a[href="/gio-hang"]');
                    await page.waitForTimeout(1000);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProductCartHaveLogin':
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    elements = await page.$$('.group');
                    await elements[3].click();
                    await page.waitForTimeout(500);
                    await page.click('button[name="addProductInCart"]');
                    await page.waitForTimeout(600);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProductCartNotLogin':
                    elements = await page.$$('.group');
                    await elements[3].click();
                    await page.waitForTimeout(500);
                    await page.click('button[name="addProductInCart"]');
                    await page.waitForTimeout(500);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'deleteProductInCart':
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(600);
                    await page.goto(test.api);
                    await page.click('button[name="deleteProductInCart"]');
                    await page.waitForTimeout(600);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showManagerProductHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    await page.goto(test.api);
                    test.check = 'U' + count;
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    break;
                case 'FormEditManagerProductHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForSelector('a[href="/bang-dieu-khien"]');
                    await page.waitForTimeout(500);
                    await page.click('a[href="/bang-dieu-khien"]');
                    elements = await page.$$('a[name="editProduct"]');
                    await elements[Math.floor(Math.random() * elements.length)].click();
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
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
deleteFilesInFolder('photo-test/');
// fetchData();
testCaseFE();