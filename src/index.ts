import express, {Express, Request, Response} from "express";
import fileUpload, {UploadedFile} from 'express-fileupload';
import dotenv from "dotenv";
import {logger} from "./services/logger";
import fs from "fs";
import process from "process";

const IMAGES_DIR = process.env.IMAGES_DIR || "/srv/nfs/docker/images";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 80;

process.on("SIGINT", () => {
  logger.log("Exiting from app");
  process.exit(0);
});

app.use(fileUpload({
  limits: {fileSize: 10 * 1024 * 1024},
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.get("/", (_req: Request, res: Response) => {
  logger.info("Got request in /");
  res.json({message: "Files API for docker NFS server!"});
});

app.get("/list", (_req: Request, res: Response) => {
  fs.readdir(`${IMAGES_DIR}`, (err, files) => {
    if (err) {
      logger.error("Error on /list");
      res.status(404).send({message: "Error trying to get files"});
      return;
    }

    const filesArray: string[] = [];
    files.forEach(file => filesArray.push(file));

    logger.info("File list requested");
    res.send(JSON.stringify(filesArray));
  });
});

app.get("/images/:id", (req: Request, res: Response) => {
  const image = req.params.id;
  logger.info(`Requested image: ${image}`);
  res.sendFile(`${IMAGES_DIR}/${image}`);
});

app.post("/upload", async (req: Request, res: Response) => {
  if (!req.files || !req.files.file) {
    res.status(422).send("No files uploaded");
    return;
  }

  if (!Array.isArray(req.files.file) && (req.files.file as UploadedFile)) {
    const file = req.files.file;

    logger.info(`File name: ${file.name}`);
    await file.mv(`${IMAGES_DIR}/${file.name}`);
  } else {
    res.status(422).send("No files uploaded");
    return;
  }

  logger.log("A file was uploaded.");
  res.status(200).send("File uploaded!");
});

app.use((req: Request, res: Response) => {
  res.status(404);
  logger.warn(`Redirecting request. ${req.url}`);
  res.json({error: "Not Found"});
});

app.listen(port, () => {
  logger.log(`[server]: Server is running at http://localhost:${port}`);
});
