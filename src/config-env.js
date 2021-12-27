const { writeFile } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

const env = process.env.ENVIRONMENT;
const isProduction = env === 'production';

let targetPath = '';
if (env === 'development') {
  targetPath = `./src/environments/environment.dev.ts`;
} else if (env === 'production') {
  targetPath = `./src/environments/environment.prod.ts`;
} else {
  targetPath = `./src/environments/environment.ts`;
}

const environmentFileContent = `
export const environment = {
  environment: '${process.env.ENVIRONMENT}',
  production: ${isProduction},
  locales: '${process.env.LOCALES}',
};
`;

writeFile(targetPath, environmentFileContent, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
