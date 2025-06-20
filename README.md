# OpenWhisk Actions | Cloud Computing Course Project

A simple collection of functions implemented for a cloud computing course project demonstrating serverless architecture, object storage that utilize technologies such as OpenWhisk and MinIO.

## 🏗️ Project Overview

This repository contains a complete cloud computing solution that demonstrates:

- **Serverless Functions**: OpenWhisk actions for data processing and email services

## 🚀 Services

### 1. Send Mail Action (`send-mail-action/`)

**Purpose**: Email service as OpenWhisk serverless application

**Features**:

- Send emails using Nodemailer
- Configured for MailHog development environment
- SMTP integration with error handling
- Promise-based implementation

**Technologies**: Nodemailer, MailHog

### 2. Save to MinIO (`save-to-minio/`)

**Purpose**: Storing temperature data in MinIO object storage as OpenWhisk serverless application

**Features**:

- Upload JSON data to MinIO bucket
- Automatic timestamp generation
- Error handling and response formatting

**Technologies**: MinIO SDK

### 3. Get Data from MinIO (`get-data-minio/`)

**Purpose**: Retrieveing and filtering data from MinIO storage as OpenWhisk serverless application

**Features**:

- Date-range filtering for data retrieval
- JSON data parsing and aggregation
- Stream-based data processing
- Error handling for malformed data

**Technologies**: MinIO SDK

### 2. Deploy OpenWhisk Actions

```bash
# Deploy send-mail action
cd send-mail-action
wsk action create send-mail-action index.js --kind nodejs:18

# Deploy save-to-minio action
cd ../save-to-minio
wsk action create save-to-minio index.js --kind nodejs:18

# Deploy get-data-minio action
cd ../get-data-minio
wsk action create get-data-minio index.js --kind nodejs:18
```

### 3. Test the Services

```bash
# Test email service
wsk action invoke send-mail-action \
  --param from "test@example.com" \
  --param to "user@example.com" \
  --param subject "Test" \
  --param text "Hello World" \
  --result

# Test data storage
wsk action invoke save-to-minio \
  --param temperature 25.5 \
  --result

# Test data retrieval
wsk action invoke get-data-minio \
  --param startDate "2023-01-01" \
  --param endDate "2023-12-31" \
  --result
```
