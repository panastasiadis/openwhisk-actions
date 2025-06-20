const minio = require('minio');

async function listObjectsBetweenDates(minioClient, bucketName, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const objects = [];
        
        minioClient.listObjectsV2(bucketName, '', true)
            .on('data', (obj) => {
                const objectDate = new Date(obj.lastModified);
                if (objectDate >= startDate && objectDate <= endDate) {
                    objects.push(obj.name);
                }
            })
            .on('end', () => {
                resolve(objects);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

async function readDataFromMinIO(params) {
    const minioClient = new minio.Client({
        endPoint: '172.17.0.1', // Replace with your MinIO server's endpoint
        port: 9000, // Default MinIO port
        useSSL: false, // Set to true if your MinIO server uses SSL
        accessKey: '9Td5SDXliKWzgftdYiBW', // Replace with your MinIO access key
        secretKey: '0IHofPOV3wEhvL5FvqVpqFPBILaq3keEVoFyy2uP', // Replace with your MinIO secret key
    });

    const bucketName = 'temperature-data'; // Replace with your MinIO bucket name
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    try {
        const objectList = await listObjectsBetweenDates(minioClient, bucketName, startDate, endDate);
        const data = [];

        for (const objectName of objectList) {
            const dataStream = await minioClient.getObject(bucketName, objectName);
            const chunks = [];
            
            dataStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            await new Promise((resolve, reject) => {
                dataStream.on('end', () => {
                    const jsonData = Buffer.concat(chunks).toString();
                    try {
                        const parsedData = JSON.parse(jsonData);
                        data.push(parsedData);
                        resolve();
                    } catch (error) {
                        reject('Error parsing JSON data');
                    }
                });
                dataStream.on('error', (error) => {
                    reject('Error reading data stream');
                });
            });
        }

        return data;
    } catch (error) {
        throw error;
    }
}

async function main(params) {
    try {
        const data = await readDataFromMinIO(params);
        return { statusCode: 200, body: data };
    } catch (error) {
        return { statusCode: 500, body: error };
    }
}

exports.main = main;
