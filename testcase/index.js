const axios = require('axios');
const FormData = require('form-data');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const filePath = 'testcase - Trang tính1.csv';
const fileTestFE = 'testcase - FE.csv';
let TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIyLCJpYXQiOjE2OTkxODY5OTZ9.9BVe5qYnPhS3LXVaN743Ob_9Z9BntY0n37VCpOdeuME";
let TOKEN_ADMIN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY5OTg4MTM4NX0.JMFQ1y7IETcOICgX7dNpM7za3CDZyzOemfGMVYbxCes";
let TOKEN_STAFF = "";
let PRODUCT_IN_CART_ID;
const STATUS = ['pending', 'confirmed', 'canceled'];
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
        const count = 0;
        for (const test of data) {
            if (isObjectEmpty(test))
                return;
            console.log(test.method);
            console.log(test.description);
            const requestBody = JSON.parse(test.inputBody);
            console.log(test.method);
            let response;
            switch (test.method) {
                case "get":
                    console.log(requestBody);
                    try {
                        response = await axios.get(test.api, requestBody);
                    } catch (error) {
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data?.code: ", response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "getProduct":
                    console.log(requestBody);
                    try {
                        response = await axios.get(test.api);
                    } catch (error) {
                        test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log(checkType(test.outputCode, response.data));
                    test.check = checkType(test.outputCode, response.data);
                    console.log(test.check);
                    break;
                case "post":
                    console.log(requestBody);
                    try {
                        response = await axios.post(test.api, requestBody);
                    } catch (error) {
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    if (response.data?.messageCode === 'signin_success' && response.data.data.user.role == "user") TOKEN = response.data?.token;
                    if (response.data?.messageCode === 'signin_success' && response.data.data.user.role == "employee") TOKEN_STAFF = response.data?.token;
                    if (response.data?.messageCode === 'signin_success' && response.data.data.user.role == "manager") TOKEN_ADMIN = response.data?.token;

                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "post-formDataHaveTokenAdmin":
                    console.log(TOKEN_ADMIN);
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
                                'Authorization': `Bearer ${TOKEN_ADMIN}`
                            },
                        });
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.messageCode);
                        console.log(error.response.data?.messageCode == test.outputCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    if (test.check) {
                        await axios.delete('http://localhost:4000/products/' + response.data?.data.product.id);
                    }
                    break;
                case "post-formDataHaveToken":
                    console.log(requestBody);
                    let data = new FormData();
                    data.append('name', requestBody.name);
                    data.append('price', requestBody.price);
                    if (requestBody.image) {
                        const fileImage = path.resolve('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                        data.append('image', fs.createReadStream(fileImage));
                    } else {
                        data.append('image', '');
                    }

                    try {
                        response = await axios.post(test.api, data, {
                            headers: {
                                ...data.getHeaders(),
                                'Authorization': `Bearer ${TOKEN}`
                            },
                        });
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.messageCode);
                        console.log(error.response.data?.messageCode == test.outputCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    if (test.check) {
                        await axios.delete('http://localhost:4000/products/' + response.data?.data.product.id);
                    }
                    break;
                case "post-formDataHaveTokenStaff":
                    console.log(requestBody);
                    let dt = new FormData();
                    dt.append('name', requestBody.name);
                    dt.append('price', requestBody.price);
                    if (requestBody.image) {
                        const fileImage = path.resolve('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                        dt.append('image', fs.createReadStream(fileImage));
                    } else {
                        dt.append('image', '');
                    }

                    try {
                        response = await axios.post(test.api, dt, {
                            headers: {
                                ...dt.getHeaders(),
                                'Authorization': `Bearer ${TOKEN}`
                            },
                        });
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.messageCode);
                        console.log(error.response.data?.messageCode == test.outputCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    if (test.check) {
                        await axios.delete('http://localhost:4000/products/' + response.data?.data.product.id);
                    }
                    break;
                case "post-formData":
                    console.log(requestBody);
                    let fData = new FormData();
                    fData.append('name', requestBody.name);
                    fData.append('price', requestBody.price);
                    if (requestBody.image) {
                        const fileImage = path.resolve('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                        fData.append('image', fs.createReadStream(fileImage));
                    } else {
                        fData.append('image', '');
                    }

                    try {
                        response = await axios.post(test.api, fData, {
                            headers: {
                                ...fData.getHeaders(),
                            },
                        });
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.messageCode);
                        console.log(error.response.data?.messageCode == test.outputCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    if (test.check) {
                        await axios.delete('http://localhost:4000/products/' + response.data?.data.product.id);
                    }
                    break;
                case "delete":
                    console.log(requestBody);
                    try {
                        response = await axios.delete(test.api, requestBody);
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.code);
                        if (!error.response.data?.code) {
                            test.check = false;
                        }
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);

                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.code);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "patch":
                    console.log(requestBody);
                    try {
                        response = await axios.patch(test.api, requestBody);
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(error.response.data?.code);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.code);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    break;
                case "put":
                    console.log(requestBody);
                    try {
                        response = await axios.put(test.api, requestBody);
                    } catch (error) {
                        console.log(test.outputCode);
                        console.log(response.data?.code);
                        response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;

                        break;
                    }
                    console.log(test.outputCode);
                    console.log(response.data?.code);
                    response.data?.code == test.outputCode ? test.check = true : test.check = false;

                    break;
                case "getHaveToken":
                    console.log(requestBody);
                    console.log(test.api);
                    try {
                        response = await axios.get(test.api, {
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`
                            }
                        });

                    } catch (error) {
                        console.log(error);
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data?.code: ", response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "postHaveToken":
                    console.log(requestBody);
                    console.log(test.api);
                    try {
                        response = await axios.post(test.api, requestBody, {
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`
                            }
                        });

                    } catch (error) {
                        console.log(error);
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data?.code: ", response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "deleteHaveToken":
                    console.log(requestBody);
                    console.log(test.api);
                    try {
                        response = await axios.delete(test.api, {
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`
                            }
                        });

                    } catch (error) {
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data?.code: ", response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "patchHaveToken":
                    console.log(requestBody);
                    console.log(test.api);
                    try {
                        response = await axios.patch(test.api, requestBody, {
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`
                            }
                        });

                    } catch (error) {
                        console.log(error.response.data?.messageCode);
                        error.response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                        console.log(test.check);
                        break;
                    }
                    console.log("test.outputCode: ", test.outputCode);
                    console.log("response.data?.code: ", response.data?.messageCode);
                    console.log(response.data?.messageCode == test.outputCode);
                    response.data?.messageCode == test.outputCode ? test.check = true : test.check = false;
                    console.log(test.check);
                    break;
                case "getTypeHaveToken":
                    console.log(requestBody);
                    try {
                        response = await axios.get(test.api, {
                            headers: {
                                'Authorization': `Bearer ${TOKEN}`
                            }
                        });
                    } catch (error) {
                        test.check = false;
                        console.log(error.response);
                        break;
                    }
                    console.log("test.outputCode: ", test);
                    console.log(checkType(test.outputCode, response.data));
                    test.check = checkType(test.outputCode, response.data);
                    console.log(test.check);
                    break;
                default:
                    break;
            }

        }
        // console.log(data);
        writeFileCSV(data, filePath)
    } catch (error) {
        // console.log(error);
        if (error.response) {
            // The request was made, but the server responded with a status code that falls out of the range of 2xx
            console.error('Response Error Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
        console.log(error);
        console.log("can't connect server");

    }
}
// async function autoPostProduct(){
//     for (let index = 0; index < 8; index++) {
//         const formData
//     }
// }
async function testCaseFE() {
    let data = await readFileCSV(fileTestFE);
    console.log(data);
    let count = 0;
    const browser = await puppeteer.launch({ headless: true, args: ['--start-maximized'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
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
                    await page.goto('http://localhost:3000/dang-nhap');
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
                    await page.goto('http://localhost:3000/dang-nhap');
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
                case 'orderProductInCart':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    await page.goto(test.api);
                    await page.waitForSelector('input[id="name"]');
                    await page.type('input[id="name"]', requestBody.name);
                    await page.type('input[id="phone"]', requestBody.phone);
                    await page.type('input[id="address"]', requestBody.address);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(600);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'deleteProductInCart':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(600);
                    await page.goto(test.api);
                    await page.waitForSelector('button[name="deleteProductInCart"]');
                    await page.click('button[name="deleteProductInCart"]');
                    await page.waitForTimeout(600);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'showManageHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(3000);
                    await page.goto(test.api);
                    test.check = 'U' + count;
                    await page.screenshot({ path: 'photo-test/U' + count + '.png' });
                    break;
                case 'FormEditManagerProductHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(3000);
                    await page.goto('http://localhost:3000/bang-dieu-khien/san-pham');
                    await page.waitForSelector('a[name="editProduct"]');
                    elements = await page.$$('a[name="editProduct"]');
                    await elements[Math.floor(Math.random() * elements.length)].click();
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'addProductHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(3000);
                    await page.goto(test.api);
                    await page.waitForSelector('input[type="file"]');
                    elements = await page.$("input[type=file]");
                    await elements.uploadFile('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                    await page.type('input[id="name"]', requestBody.name);
                    await page.type('input[id="price"]', requestBody.price);
                    await page.type('textarea[id="description"]', requestBody.description);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png' });
                    test.check = 'U' + count;
                    break;
                case 'updateProductHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(3000);
                    await page.goto(test.api);
                    await page.waitForSelector('input[type="file"]');
                    elements = await page.$("input[type=file]");
                    await elements.uploadFile('/home/anhthai/PTIT/watch-store/testcase/' + requestBody.image);
                    await page.type('input[id="name"]', requestBody.name);
                    await page.type('input[id="price"]', requestBody.price);
                    await page.type('textarea[id="description"]', requestBody.description);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1500);
                    await page.screenshot({ path: 'photo-test/U' + count + '.png'});
                    test.check = 'U' + count;
                    break;
                case 'showFormUpdateStatusOrderHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.goto(test.api);
                    await page.waitForTimeout(3000);
                    elements = await page.$$('a[name="editOrder"]');
                    await elements[Math.floor(Math.random() * elements.length)].click();
                    await page.screenshot({ path: 'photo-test/U' + count + '.png', fullPage: true });
                    test.check = 'U' + count;
                    break;
                case 'updateStatusOrderHaveLogin':
                    await page.goto('http://localhost:3000/dang-nhap');
                    await page.waitForSelector('input[type="email"]');
                    await page.type('input[type="email"]', requestBody.email);
                    await page.type('input[type="password"]', requestBody.password);
                    await page.click('button[type="submit"]');
                    await page.waitForTimeout(1000);
                    await page.goto(test.api);
                    await page.waitForTimeout(3000);
                    await page.select('#status', STATUS[+requestBody.status]);
                    await page.click('button[type="submit"]');
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