/**
 * UploadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  upload: async (req, res) => {
    req.file('files').upload(
      {
        dirname: require('path').resolve(
          sails.config.appPath,
          sails.config.custom.uploadsPath
        ),
      },
      async (err, uploadedFiles) => {
        if (err) {
          return sendError(
            makeError(400, 'Failed to upload files.', 'UploadFailed'),
            res
          );
        }

        const attachments = uploadedFiles.map(x => ({
          link: x.fd.split("/")[7],
          size: x.size,
          type: x.type,
          filename: x.filename,
        }));

        const uploadedImages = await Image.createEach(attachments).fetch();

        return res.status(201).json({
          message: uploadedFiles.length + ' file(s) uploaded successfully!',
          uploadedFiles,
          uploadedImages,
        });
      }
    );
  },
};
