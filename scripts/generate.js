#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const opsPath = path.join(root, 'data/operations.json');
const workerTemplatePath = path.join(root, 'templates/gateway.worker.template.js');
const specTemplatePath = path.join(root, 'templates/gateway.openapi.template.yaml');

const ops = JSON.parse(fs.readFileSync(opsPath, 'utf8'));
if (!Array.isArray(ops)) {
  throw new Error('data/operations.json must export an array of operations');
}

const workerTemplate = fs.readFileSync(workerTemplatePath, 'utf8');
if (!workerTemplate.includes('__OPS_ARRAY__')) {
  throw new Error('Worker template missing __OPS_ARRAY__ placeholder');
}

const specTemplate = fs.readFileSync(specTemplatePath, 'utf8');
if (!specTemplate.includes('__OPERATIONS_ENUM__') || !specTemplate.includes('__OPERATIONS_TABLE__')) {
  throw new Error('Spec template missing placeholders');
}

const opsArrayString = JSON.stringify(ops, null, 2);
let workerOutput = workerTemplate.replace('__OPS_ARRAY__', opsArrayString);
if (!workerOutput.endsWith('\n')) workerOutput += '\n';
fs.writeFileSync(path.join(root, 'gateway.worker.js'), workerOutput);

const uniqueOps = [];
for (const entry of ops) {
  if (!entry || typeof entry.operation !== 'string' || typeof entry.method !== 'string' || typeof entry.path !== 'string') {
    throw new Error(`Invalid operation entry: ${JSON.stringify(entry)}`);
  }
  if (!uniqueOps.includes(entry.operation)) {
    uniqueOps.push(entry.operation);
  }
}

const enumLines = uniqueOps.map(op => `        - ${op}`).join('\n');
const metaExampleOps = uniqueOps.slice(0, 4).map(op => `                      - ${op}`).join('\n') || '                      - <none>';
const operationsTable = ops.map(op => `  - operation: ${op.operation}\n    method: ${op.method}\n    path: ${op.path}`).join('\n');

let specOutput = specTemplate
  .replace('__OPERATIONS_ENUM__', enumLines)
  .replace('__META_EXAMPLE_OPERATIONS__', metaExampleOps)
  .replace('__OPERATIONS_TABLE__', operationsTable);
if (!specOutput.endsWith('\n')) specOutput += '\n';
fs.writeFileSync(path.join(root, 'gateway.openapi.yaml'), specOutput);

console.log('Generated gateway.worker.js and gateway.openapi.yaml from data/operations.json');
