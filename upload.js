const AWS = require('aws-sdk');
const fs = require('node:fs');
const path = require('node:path');

// Configurar credenciais
const spacesEndpoint = new AWS.Endpoint('sfo3.digitaloceanspaces.com'); // Substitua pelo seu endpoint
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'XXXXX',
  secretAccessKey: 'XXXXX',
});

// Nome do bucket
const bucketName = 'bucket';

// Caminho da pasta local
const localFolderPath = './files';

// Ler todos os arquivos da pasta
fs.readdir(localFolderPath, (err, files) => {
  if (err) {
    return console.error('Erro ao ler a pasta:', err);
  }

  files.forEach((file) => {
    const filePath = path.join(localFolderPath, file);

    // Criar stream de leitura
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (streamErr) => {
      console.error(`Erro ao ler o arquivo ${file}:`, streamErr);
    });

    const formattedFileName = file.toLowerCase().replace(/\s+/g, '-');

    // Enviar para o bucket
    s3.upload(
      {
        Bucket: bucketName,
        Key: `folder/${formattedFileName}`, // nome do arquivo no Spaces
        Body: fileStream,
      },
      (uploadErr, data) => {
        if (uploadErr) {
          console.error(`Erro ao fazer upload de ${file}:`, uploadErr);
        } else {
          console.log(`Upload concluído: ${file} → ${data.Location}`);
        }
      }
    );
  });
});
