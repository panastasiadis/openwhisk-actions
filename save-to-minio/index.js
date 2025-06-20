const minio = require('minio');

async function uploadToMinIO(params) {
    const minioClient = new minio.Client({
        endPoint: '172.17.0.1',
        port: 9000,
        useSSL: false,
        accessKey: '9Td5SDXliKWzgftdYiBW', 
        secretKey: '0IHofPOV3wEhvL5FvqVpqFPBILaq3keEVoFyy2uP',
    });

    const bucketName = 'temperature-data';
    const objectName = `data-${Date.now()}.json`;

    const data = {
        temperature: params.temperature,
        timestamp: new Date().toISOString(),
    };

    const jsonData = JSON.stringify(data);

    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, objectName, jsonData, (err, etag) => {
            if (err) {
                reject('Error uploading data to MinIO');
            } else {
                resolve('Data uploaded successfully to MinIO');
            }
        });
    });
}

async function main(params) {
    try {
        const result = await uploadToMinIO(params);
        return { statusCode: 200, body: result };
    } catch (error) {
        return { statusCode: 500, body: error };
    }
}

exports.main = main;
