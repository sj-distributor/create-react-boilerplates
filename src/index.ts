import spawn from 'cross-spawn';
import { red, reset } from 'kolorist';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';

import { frameworks, templates } from './templates';
import { Framework } from './types';
import {
  argv,
  cwd,
  emptyDir,
  formatTargetDir,
  getProjectName,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  setupReactSwc,
  toValidPackageName,
  write,
} from './utils';

const DEFAULT_TARGET_DIR = 'react-project';

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);

  const argTemplate = argv.template || argv.t;

  let targetDir = argTargetDir || DEFAULT_TARGET_DIR;

  let result: prompts.Answers<
    'projectName' | 'overwrite' | 'packageName' | 'framework' | 'boilerplate'
  >;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: DEFAULT_TARGET_DIR,
          onState: state => {
            targetDir = formatTargetDir(state.value) || DEFAULT_TARGET_DIR;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled');
            }

            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: () => (isValidPackageName(getProjectName(targetDir)) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName(targetDir)),
          validate: dir =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type:
            argTemplate && templates.includes(argTemplate) ? null : 'select',
          name: 'framework',
          message:
            typeof argTemplate === 'string' && !templates.includes(argTemplate)
              ? reset(
                  `"${argTemplate}" isn't a valid template. Please choose from below: `,
                )
              : reset('Select a framework:'),
          initial: 0,
          choices: frameworks.map(item => {
            const frameworkColor = item.color;

            return {
              title: frameworkColor(item.display || item.name),
              value: item,
            };
          }),
        },
        {
          type: (framework: Framework) =>
            framework && framework.boilerplate ? 'select' : null,
          name: 'boilerplate',
          message: reset('Select a boilerplate:'),
          choices: (framework: Framework) =>
            framework.boilerplate.map(item => {
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
          throw new Error(red('✖') + ' Operation cancelled');
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);

    return;
  }

  // user choice associated with prompts
  const { framework, overwrite, packageName, boilerplate } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  // determine template
  let template: string = boilerplate || framework?.name || argTemplate;

  let isReactSwc = false;

  if (template.includes('-swc')) {
    isReactSwc = true;
    template = template.replace('-swc', '');
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);

  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.');

  const { customCommand } =
    frameworks.flatMap(f => f.boilerplate).find(v => v.name === template) ?? {};

  if (customCommand) {
    const fullCustomCommand = customCommand
      .replace(/^npm create/, `${pkgManager} create`)
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // Prefer `pnpm dlx` or `yarn dlx`
        if (pkgManager === 'pnpm') {
          return 'pnpm dlx';
        }
        if (pkgManager === 'yarn' && !isYarn1) {
          return 'yarn dlx';
        }

        // Use `npm exec` in all other cases,
        // including Yarn 1.x and other custom npm clients.
        return 'npm exec';
      });

    const [command, ...args] = fullCustomCommand.split(' ');

    // we replace TARGET_DIR here because targetDir may include a space
    const replacedArgs = args.map(arg => arg.replace('TARGET_DIR', targetDir));

    const { status } = spawn.sync(command, replacedArgs, {
      stdio: 'inherit',
    });

    process.exit(status ?? 0);
  }

  console.log(`\nBoilerplate project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../template/',
    `template-${template}`,
  );

  const files = fs.readdirSync(templateDir);

  for (const file of files.filter(f => f !== 'package.json')) {
    write(root, templateDir, file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );

  pkg.name = packageName || getProjectName(targetDir);

  write(root, templateDir, 'package.json', JSON.stringify(pkg, null, 2) + '\n');

  if (isReactSwc) {
    setupReactSwc(root, template.endsWith('-ts'));
  }

  const cdProjectName = path.relative(cwd, root);

  console.log(`\nDone. Now run:\n`);

  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    );
  }
  
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn');
      console.log('  yarn dev');
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
