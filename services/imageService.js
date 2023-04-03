const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
const uuid = require("uuid").v4;
const fse = require("fs-extra");
const fs = require("fs");
const AppError = require("../utils/appError");

class ImageService {
  static upload(name) {
    const multerStorage = multer.diskStorage({
      destination: (req, file, callBackFunc) => {
        callBackFunc(null, "tmp");
      },
      filename: (req, file, callBackFunc) => {
        const ext = file.mimetype.split("/")[1];
        callBackFunc(null, `${uuid()}.${ext}`);
      },
    });

    const multerFilter = (req, file, callbackFn) => {
      if (file.mimetype.startsWith("image")) {
        callbackFn(null, true);
      } else {
        callbackFn(new AppError(401, "Not authorized"), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, width, height, ...pathSegments) {
    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), "public", ...pathSegments);
    const deleteFile = (path) => {
      fs.unlink(path, (err) => {
        if (err) {
          return console.log(err);
        }
      });
    };
    await fse.ensureDir(fullFilePath);

    await jimp
      .read(file.path)
      .then((newFile) => {
        return newFile
          .cover(width, height || jimp.AUTO)
          .quality(90)
          .writeAsync(path.join(fullFilePath, fileName));
      })
      .catch((err) => {
        console.error(err);
      });
    deleteFile(file.path);
    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
