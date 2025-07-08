import { testLoanWorkflow } from '../utils/testUtils';

describe('Loan Workflow Test', () => {
  it('should test the complete loan workflow', async () => {
    await testLoanWorkflow();
  });
});
