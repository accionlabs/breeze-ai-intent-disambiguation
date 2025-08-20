#!/usr/bin/env node

// Script to run the resolution test suite
import { ResolutionTestRunner, TEST_CASES } from './resolutionTestSuite';

console.log('Starting Intent Resolution Test Suite...\n');

// Create test runner
const runner = new ResolutionTestRunner();

// Run all tests
const results = runner.runTests(TEST_CASES);

// Generate and display report
const report = runner.generateReport();
console.log(report);

// Exit with appropriate code
const allPassed = results.every(r => r.passed);
process.exit(allPassed ? 0 : 1);