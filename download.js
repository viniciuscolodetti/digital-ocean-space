const AWS = require('aws-sdk');
const fs = require('node:fs');

// Configurar credenciais
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com'); // Substitua pelo seu endpoint
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'XXXX',
  secretAccessKey: 'XXXXXXX',
});

// Nome do bucket e do arquivo
const bucketName = 'asset-design-space';
const fileName = 'file-name.tar.gz'; // Caminho no Spaces
const localFilePath = './file-name.tar.gz'; // Onde salvar localmente

// Criar stream de escrita para evitar sobrecarga de memória
const fileStream = fs.createWriteStream(localFilePath);

s3.getObject({ Bucket: bucketName, Key: fileName })
  .createReadStream()
  .on('error', (err) => {
    console.error('Erro no download:', err);
  })
  .pipe(fileStream)
  .on('close', () => {
    console.log('Download concluído com sucesso!');
  });
