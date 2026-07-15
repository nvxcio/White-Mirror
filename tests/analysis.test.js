const assert = require('assert');
const { calculateAnalysis } = require('../server');

const result = calculateAnalysis({ coherence: 0.84, resilience: 0.78, consent: 0.81, transparency: 0.9 });

assert.strictEqual(typeof result.effectiveness, 'number');
assert.ok(result.effectiveness >= 0);
assert.ok(result.compliance >= 0 && result.compliance <= 100);
assert.ok(result.recursionGain >= 0);
assert.ok(result.selfApplication >= 0 && result.selfApplication <= 100);
console.log('analysis tests passed');
