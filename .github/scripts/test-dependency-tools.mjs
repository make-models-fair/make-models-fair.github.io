import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = name => fileURLToPath(new URL(name, import.meta.url));

function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'tobefair-deps-'));
  try {
    mkdirSync(join(root, 'packages/hugoautogen'), { recursive: true });
    mkdirSync(join(root, 'node_modules'));
    writeFileSync(join(root, 'node_modules/installed-marker'), 'installed dependencies');
    chmodSync(join(root, 'node_modules'), 0o555);
    writeFileSync(join(root, 'package.json'), JSON.stringify({
      name: 'review-site', version: '1.0.0', private: true,
      workspaces: ['packages/hugoautogen'],
    }));
    writeFileSync(join(root, 'packages/hugoautogen/package.json'), JSON.stringify({
      name: 'review-workspace', version: '1.0.0', private: true,
    }));
    writeFileSync(join(root, 'package-lock.json'), JSON.stringify({
      name: 'review-site', version: '1.0.0', lockfileVersion: 3, packages: {},
    }));
    return run(root);
  } finally {
    chmodSync(join(root, 'node_modules'), 0o755);
    rmSync(root, { recursive: true, force: true });
  }
}

function run(root, name, extra = {}) {
  return spawnSync('sh', [script(name)], {
    cwd: root, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, HOME: root, npm_config_cache: join(root, '.npm'), npm_config_offline: 'true', ...extra },
  });
}

test('Docsy rejects floating, incomplete, prerelease and shell-like selections before changing files', () => fixture(root => {
  for (const version of ['', 'latest', 'main', 'v0.18', 'v0.18.1-rc.1', 'v0.18.1; touch injected']) {
    const result = run(root, 'update-docsy.sh', { DOCSY_VERSION: version });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /exact stable release/);
  }
  assert.equal(existsSync(join(root, '.gitconfig')), false);
  assert.equal(existsSync(join(root, 'injected')), false);
}));

test('npm lock resolution includes the workspace without modifying read-only installed dependencies', () => fixture(root => {
  const result = run(root, 'update-npm-lock.sh');
  assert.equal(result.status, 0, result.stderr);
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  assert.equal(lock.packages['node_modules/review-workspace'].link, true);
  assert.equal(readFileSync(join(root, 'node_modules/installed-marker'), 'utf8'), 'installed dependencies');
  assert.equal(existsSync(join(root, 'node_modules/review-workspace')), false);
}));

test('failed npm resolution preserves the existing project lockfile', () => fixture(root => {
  const before = readFileSync(join(root, 'package-lock.json'));
  writeFileSync(join(root, 'package.json'), '{invalid JSON');
  const result = run(root, 'update-npm-lock.sh');
  assert.notEqual(result.status, 0);
  assert.equal(result.error, undefined, 'resolution must fail without a timeout');
  assert.deepEqual(readFileSync(join(root, 'package-lock.json')), before);
}));
