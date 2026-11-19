import { test as base } from '@playwright/test'
import {analyzeFailure} from "../agent/failureAnalysis";
import {generateFailureReport, FailureReportEntry} from "../utilities/Failurereport";

export const test = base.extend({})

const failureEntries: FailureReportEntry[] = [];

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
    testInfo.setTimeout(testInfo.timeout + 60000); // Extend timeout for failure analysis
    const errorMessage = testInfo.error?.message || 'No error message available';
    const stackTrace = testInfo.error?.stack || 'No stack trace available';
    let analysis: string;

    try {
      analysis = await analyzeFailure(testInfo.title, errorMessage, stackTrace);
    } catch (error) {
      const analysisError = error instanceof Error ? error.message : String(error);
      analysis = `Failure analysis was unavailable: ${analysisError}`;
      console.error(`Failure analysis could not be generated for "${testInfo.title}": ${analysisError}`);
    }

    failureEntries.push({
      testName: testInfo.titlePath.join(' › '),
      errorMessage,
      stackTrace,
      analysis,
      status: testInfo.status
    });

    await generateFailureReport(failureEntries);
  }
});
