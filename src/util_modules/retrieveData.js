const Storage = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();
const bucketName = "regi_storage";
const srcFilename = "sample.csv";
const destFilename = "./locationDuration.csv";
const options = {destination: destFilename};

module.exports = {
  retrieveData: function() {
    storage.getBuckets().then((results) => {
      const buckets = results[0];
      console.log('Buckets:');
      buckets.forEach((bucket) => {
        console.log(bucket.name);
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });

    storage
    .bucket(bucketName)
    .file(srcFilename)
    .download(options).then(() => {
      console.log(
        `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
      );
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  }
}


// Makes an authenticated API request.
