# Toolbox Files API

## Overview

This is a Node.js + Express API that provides file data to the Toolbox Files frontend.
It fetches a list of available files from a remote endpoint, retrieves CSV content for each selected file, formats the CSV into JSON, and returns the processed data.

## Features

- `/files/data` endpoint returns formatted file contents
- `/files/list` endpoint returns the available file list
- optional `fileName` query parameter to filter by a specific file
- built with Express and Axios
- includes tests for service functions

## Requirements

- Node.js >= 14
- npm >= 6.14.18

## Setup

Install dependencies:

```bash
npm install
```

## Running locally

Start the server:

```bash
npm start
```

The API will run on `http://localhost:3001` by default, or `process.env.PORT` if configured.

## Available Scripts

### `npm start`

Starts the Express server.

### `npm test`

Runs the test suite using Mocha.

### `npm run lint`

Runs StandardJS and fixes formatting issues.

### `npm run build`

No build step is required for this pure Node.js project.

## API Endpoints

### `GET /files/list`

Returns the list of available files fetched from the remote service.

Example response:

```json
{
  "files": ["file1.csv", "file2.csv"]
}
```

### `GET /files/data`

Returns formatted JSON data for the available files.
If the query parameter `fileName` is provided, the API filters to that file only.

Example request:

```http
GET /files/data?fileName=file1.csv
```

Example response:

```json
[
  {
    "file": "file1.csv",
    "lines": [
      {
        "number": "123",
        "text": "hello",
        "hex": "abcd"
      }
    ]
  }
]
```

## Architecture

- `index.js` starts the Express server
- `src/app.js` configures middleware and routes
- `src/routes/filesRouter.js` defines `/files/data` and `/files/list`
- `src/services/filesService.js` contains the business logic for fetching and formatting data

### Data flow

1. Client requests `/files/data` or `/files/list`
2. Express route forwards the request to the service handler
3. The service fetches file metadata from `https://echo-serv.tbxnet.com/v1/secret/files`
4. For `/files/data`, the service fetches each selected CSV file and converts it to JSON
5. The response is returned to the client

## Configuration

This project does not require additional environment configuration for the default behavior.
If you need to change the target backend for file fetches, update the URL inside the service implementation in `src/services/filesService.js`.

## Testing

Run all tests with:

```bash
npm test
```

Tests are located in the `test/` directory and use Mocha + Chai.

## Docker

Build the Docker image:

```bash
docker build -t toolbox-files-api .
```

Run the container:

```bash
docker run -p 3001:3001 toolbox-files-api
```

## Troubleshooting

- If the API fails to start, confirm Node.js and npm versions match the `engines` section in `package.json`.
- If file data is missing, check that the remote `echo-serv` endpoint is reachable and responding.
- If tests fail, run `npm test` and inspect the failed output.

## Notes

This README includes setup, endpoint documentation, architecture, and testing instructions for reviewers and collaborators.