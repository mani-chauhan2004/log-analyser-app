# Log Analyzer App

---

## Overview

The **Log Analyzer App** processes, validates, and analyzes logs from various file formats such as JSON, CSV, and plain text. It enables filtering, searching, and sorting logs while storing them in **Elasticsearch** and **MongoDB** for scalable and efficient querying.

---

## Setup Instructions

### Prerequisites
1. **Node.js**: Install Node.js (v6.7 or later).
2. **MongoDB**: Ensure a running MongoDB instance (local or MongoDB Atlas).
3. **Elasticsearch**: Install and run Elasticsearch (v7.x or higher).
4. **Postman**: Recommended for API testing.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mani-chauhan2004/log-analyser-app.git

2. Use terminal to navigate to the log-analyzer-app folder:
    ```bash
   cd log-analyzer-app

3. Install the required dependencies(refer to package.json for more information):
    ```bash
   npm install

4. Start the app:
    ```bash
   nodemon app.js --ignore uploads/

### Environment Variables Setup (.env) 
  ```bash
  PORT=<PORT>
  ELASTICSEARCH_URI=<ElasticSearch running port(Default: http://localhost:9200)>
  NODE_ENV=<Any(eg. development/ production)>
  MONGO_URI=<Your mongoDB connection string here>
  ```

## API Reference

### **Base URLs**
- **Primary**: `http://localhost:5000/api/logs`
- **Secondary** (if port 5000 is busy): `http://localhost:3000/api`

### **Endpoints**

#### **1. Upload Logs**
- **POST** `/upload`
  - **Description**: Upload one or multiple log files for processing.
  - **Headers**: 
    - `Content-Type: multipart/form-data`
  - **Body**: 
    - `logFiles`: One or more files to be uploaded (maxfiles: 10).
  - **Response**:
    ```json
    {
        "message": "Logs uploaded successfully.",
        "totalProcessed": 100,
        "validLogs": 90,
        "invalidLogs": 10
    }
    ```

#### **2. Search Logs**
- **GET** `/search`
  - **Description**: Search logs by type, keyword, and date range.
  - **Query Parameters**:
    | Key         | Significance  | Description                                  |
    |-------------|---------------|----------------------------------------------|
    | `type`      | Optional      | Filter logs by type (e.g., INFO, ERROR).     |
    | `keyword`   | Optional      | Search for specific keywords in the logs.   |
    | `startDate` | Optional      | Filter logs starting from this date.        |
    | `endDate`   | Optional      | Filter logs up to this date.                |
    | `sortBy`    | Optional      | Field to sort by (e.g., timestamp).         |
    | `sortOrder` | Optional      | Sort order: `asc` or `desc`.                |
    | `source`    | Optional      | Filter logs from this source.               |

  - **Response**:
    ```json
    {
        "logs": [
            {
                "type": "INFO",
                "timestamp": "2024-12-03T10:15:30Z",
                "message": "Application started successfully."
            }
        ]
    }
    ```

#### **3. Process Logs**
- **GET** `/process`
  - **Description**: Process unprocessed logs from the database and index them into Elasticsearch.
  - **Response**:
    ```json
    {
        "message": "Logs processed successfully.",
        "totalProcessed": 70,
        "validLogs": 55,
        "invalidLogs": 15
    }
    ```

## System Design

### **1. Architecture**
- **Frontend**: *(Future)* Allows users to upload files and search logs.
- **Backend**: Built with Node.js and Express for handling file uploads, log validation, and querying.
- **Database**:
  - **MongoDB**: Stores raw logs and validation metadata.
  - **Elasticsearch**: Enables efficient log querying and filtering.
- **File Storage**: Uploaded files are temporarily stored in the `uploads/` directory.

### **2. Workflow**
1. **File Upload**:
   - Accepts files via `/upload` API.
   - Files are parsed, validated, and stored.
2. **Log Storage**:
   - Valid logs are indexed into Elasticsearch.
   - Raw logs are stored in MongoDB.
3. **Log Query**:
   - Users can search logs using `/search` with filters and sorting.

---

## Sample Log Formats Supported

### **1. JSON**
```json
[
    {
        "timestamp": "2024-12-03T10:15:30Z",
        "type": "INFO",
        "message": "Application started successfully."
    }
]
```

### **2. CSV**
```
    timestamp,type,message
    2024-12-03T10:15:30Z,INFO,Application started successfully.
```

### **3. PLAIN TEXT**
```
    [2024-12-03T10:15:30Z] [INFO] Application started successfully.

```

## Future Improvements

1. **Frontend Integration**
   - Designing the frontend using libraries and frameworks like React to upload and display search results along with performance analysis.

2. **Robust Queries**
   - Adding advanced searching capabilities to the application, such as fuzzy matching search.

3. **Privacy and Security**
   - Securing the API through various methods of authentication and authorization.

4. **Cloud Integration**
   - Using a cloud-based database that can store and process large amounts of data more efficiently.

5. **Robust Log Format Analysis**
   - Enhancing the application to analyze various other log formats, such as XML and Apache logs.
