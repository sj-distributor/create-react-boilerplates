/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import spawn from 'cross-spawn';
import { red, reset } from 'kolorist';
import prompts from 'prompts';

import { boilerplates } from './boilerplates';
import {
  argv,
  cwd,
  emptyDir,
  formatDir,
  getProjectName,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  toValidPackageName,
  write,
} from './utils';

const DEFAULT_TARGET_DIR = 'react-project';

async function init() {
  const argvTargetDir = formatDir(argv._[0]);

  const argvTemplate = argv.template || argv.t;

  let targetDir = argvTargetDir || DEFAULT_TARGET_DIR;

  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'boilerplate'
  >;

  try {
    result = await prompts(
      [
        {
          type: argvTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: DEFAULT_TARGET_DIR,
          onState: state => {
            targetDir = formatDir(state.value) || DEFAULT_TARGET_DIR;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'select',
          name: 'overwrite',
          message: () =>
            `${targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`
            } is not empty. Please select the steps to perform：`,
          initial: 0,
          choices: [
            {
              title: 'Cancel operation',
              value: 1,
            },
            {
              title: 'Ignore files and continue',
              value: 2,
            },
            {
              title: 'Delete the current file and continue',
              value: 3,
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: number }) => {
            if (overwrite === 1) {
              throw new Error(`${red('✖')} Operation cancelled`);
            }

            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () =>
            isValidPackageName(getProjectName(targetDir)) ? null : 'text',
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName(targetDir)),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'select',
          name: 'boilerplate',
          message: reset('Select a boilerplate:'),
          choices: boilerplates.map(item => {
            const variantColor = item.color;

            return {
              title: variantColor(item.display || item.name),
              value: item.name,
            };
          }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red('✖')} Operation cancelled`);
        },
      },
    );
  }
  catch (cancelled: any) {
    console.log(cancelled.message);

    return;
  }

  // user choice associated with prompts
  const { overwrite, packageName, boilerplate } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite === 3) {
    emptyDir(root);
  }
  else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  // determine template
  const template: string = boilerplate || argvTemplate;

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);

  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.');

  const { customCommand } = boilerplates.find(v => v.name === template) ?? {};

  if (customCommand) {
    const fullCustomCommand = customCommand
      .replace(/^npm create/, () => {
        // `bun create` uses it's own set of templates,
        // the closest alternative is using `bun x` directly on the package
        if (pkgManager === 'bun') {
          return 'bun x create-';
        }

        return `${pkgManager} create `;
      })
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
        if (pkgManager === 'pnpm') {
          return 'pnpm dlx';
        }

        if (pkgManager === 'yarn' && !isYarn1) {
          return 'yarn dlx';
        }

        if (pkgManager === 'bun') {
          return 'bun x';
        }

        // Use `npm exec` in all other cases,
        // including Yarn 1.x and other custom npm clients.
        return 'npm exec';
      });

    const [command, ...args] = fullCustomCommand.split(' ');

    // we replace TARGET_DIR here because targetDir may include a space
    const replacedArgs = args.map(arg =>
      arg.replace('TARGET_DIR', targetDir),
    );

    const { status } = spawn.sync(command, replacedArgs, {
      stdio: 'inherit',
    });

    process.exit(status ?? 0);
  }

  console.log(`\nBoilerplate project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../templates/',
    `template-${template}`,
  );

  const files = fs.readdirSync(templateDir);

  for (const file of files.filter(f => f !== 'package.json')) {
    write(root, templateDir, file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'),
  );

  pkg.name = packageName || getProjectName(targetDir);

  write(root, templateDir, 'package.json', `${JSON.stringify(pkg, null, 2)}\n`);

  const cdProjectName = path.relative(cwd, root);

  console.log('\nDone. Now run:\n');

  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    );
  }

  switch (pkgManager) {
    case 'pnpm':
      console.log('  pnpm');
      console.log('  pnpm dev');
      break;
    default:
      console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} run dev`);
      break;
  }
}

init().catch(e => {
  console.error(e);
});
