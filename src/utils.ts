import fs from 'node:fs';
import path from 'node:path';

import minimist from 'minimist';

export const cwd = process.cwd();

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
};

export const argv = minimist<{
  t?: string;
  template?: string;
}>(process.argv.slice(2), { string: ['_'] });

export const formatDir = (targetDir: string | undefined) => {
  return targetDir?.trim().replace(/\/+$/g, '');
};

export const isValidPackageName = (projectName: string) => {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
};

export const toValidPackageName = (projectName: string) => {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
};

export const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    copyDir(src, dest);
  }
  else {
    fs.copyFileSync(src, dest);
  }
};

export const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);

    const destFile = path.resolve(destDir, file);

    copy(srcFile, destFile);
  }
};

export const isEmpty = (path: string) => {
  const files = fs.readdirSync(path);

  return files.length === 0 || (files.length === 1 && files[0] === '.git');
};

export const emptyDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
};

export const pkgFromUserAgent = (userAgent: string | undefined) => {
  if (!userAgent) {
    return undefined;
  }

  const pkgSpec = userAgent.split(' ')[0];

  const pkgSpecArr = pkgSpec.split('/');

  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
};

export const editFile = (
  file: string,
  callback: (content: string) => string,
) => {
  const content = fs.readFileSync(file, 'utf-8');

  fs.writeFileSync(file, callback(content), 'utf-8');
};

export const getProjectName = (targetDir: string) => {
  return targetDir === '.' ? path.basename(path.resolve()) : targetDir;
};

export const write = (
  root: string,
  templateDir: string,
  file: string,
  content?: string,
) => {
  const targetPath = path.join(root, renameFiles[file] ?? file);

  if (content) {
    fs.writeFileSync(targetPath, content);
  }
  else {
    copy(path.join(templateDir, file), targetPath);
  }
};
