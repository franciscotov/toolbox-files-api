import axios from "axios";
import {
  formatCsvDataToJson,
  errorTypes,
  errorMassages,
  buildErrorObject,
} from "../common/utils.js";

const API_URL = "https://echo-serv.tbxnet.com/v1";

const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer aSuperSecretKey",
  },
};

async function getFiles(req, res) {
  try {
    // get files list from https://echo-serv.tbxnet.com/v1/secret/files
    // get files one by one from https://echo-serv.tbxnet.com/v1/secret/file/file1.csv
    // format the data
    // send the formated data
    const dat = await axios.get(`${API_URL}/secret/files`, options);
    const files = dat.data.files;

    return await searchFilesInfo(req, res, files);
  } catch (error) {
    return res
      .status(500)
      .send(
        buildErrorObject(
          errorTypes.internalServerError,
          errorMassages.internalServerError,
        ),
      );
  }
}

async function searchFilesInfo(req, res, files) {
  const promises = [];
  const { fileName } = req.query;
  if (fileName) {
    if (!files.includes(fileName)) {
      return res
        .status(404)
        .send(
          buildErrorObject(errorTypes.fileNotFound, errorMassages.fileNotFound),
        );
    }
    files = files.filter((file) => file === fileName);
  }

  if (files && files.length > 0) {
    for (const file of files) {
      const p = axios.get(`${API_URL}/secret/file/${file}`, options);
      promises.push(p);
    }
    const results = await Promise.allSettled(promises);
    const formattedData = formatCsvDataToJson(results);
    return res.status(200).send(formattedData);
  }
  res.status(200).send([]);
}

async function getFilesList(req, res) {
  // get files list from https://echo-serv.tbxnet.com/v1/secret/files
  // send the data
  try {
    const dat = await axios.get(`${API_URL}/secret/files`, options);
    const data = dat.data;
    return res.status(200).send(data);
  } catch (error) {
    return res
      .status(500)
      .send(
        buildErrorObject(
          errorTypes.internalServerError,
          errorMassages.internalServerError,
        ),
      );
  }
}

export { getFiles, getFilesList };
