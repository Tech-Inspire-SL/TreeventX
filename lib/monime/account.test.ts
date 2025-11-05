import { createMonimeAccount, getMonimeAccount, getAccountBalance } from './account';
import { createClient } from 'monime-package';

// Mock the monime-package
jest.mock('monime-package', () => ({
  createClient: jest.fn().mockReturnValue({
    financialAccount: {
      create: jest.fn(),
      get: jest.fn(),
    },
  }),
}));

describe('createMonimeAccount', () => {
  const mockCreate = createClient().financialAccount.create as jest.Mock;

  beforeEach(() => {
    mockCreate.mockClear();
  });

  it('should call client.financialAccount.create with the correct parameters', async () => {
    const accountName = 'Test Account';
    mockCreate.mockResolvedValue({ success: true, data: { result: { id: '123' } } });

    await createMonimeAccount({ name: accountName });

    expect(mockCreate).toHaveBeenCalledWith(accountName, 'SLE');
  });

  it('should return the account data on successful creation', async () => {
    const accountName = 'Test Account';
    const mockResponse = { id: '123', name: accountName, currency: 'SLE' };
    mockCreate.mockResolvedValue({ success: true, data: { result: mockResponse } });

    const result = await createMonimeAccount({ name: accountName });

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if the API call fails', async () => {
    const accountName = 'Test Account';
    mockCreate.mockResolvedValue({ success: false, error: { message: 'API Error' } });

    await expect(createMonimeAccount({ name: accountName })).rejects.toThrow(
      'Failed to create payment account'
    );
  });

  it('should throw an error if response.data is missing', async () => {
    const accountName = 'Test Account';
    mockCreate.mockResolvedValue({ success: true, data: null });

    await expect(createMonimeAccount({ name: accountName })).rejects.toThrow(
      'Failed to create payment account'
    );
  });
});

describe('getMonimeAccount', () => {
  const mockGet = createClient().financialAccount.get as jest.Mock;

  beforeEach(() => {
    mockGet.mockClear();
  });

  it('should call client.financialAccount.get with the correct accountId', async () => {
    const accountId = 'acc_123';
    mockGet.mockResolvedValue({ success: true, data: { result: { id: accountId } } });

    await getMonimeAccount(accountId);

    expect(mockGet).toHaveBeenCalledWith(accountId);
  });

  it('should return the account data on success', async () => {
    const accountId = 'acc_123';
    const mockResponse = { id: accountId, name: 'Test Account' };
    mockGet.mockResolvedValue({ success: true, data: { result: mockResponse } });

    const result = await getMonimeAccount(accountId);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if the API call fails', async () => {
    const accountId = 'acc_123';
    mockGet.mockResolvedValue({ success: false, error: { message: 'API Error' } });

    await expect(getMonimeAccount(accountId)).rejects.toThrow(
      'Failed to retrieve payment account'
    );
  });
});

describe('getAccountBalance', () => {
  const mockGet = createClient().financialAccount.get as jest.Mock;

  beforeEach(() => {
    mockGet.mockClear();
  });

  it('should return the account balance on success', async () => {
    const accountId = 'acc_123';
    const mockBalance = 1000;
    const mockResponse = {
      id: accountId,
      balance: { available: { value: mockBalance } },
    };
    mockGet.mockResolvedValue({ success: true, data: { result: mockResponse } });

    const result = await getAccountBalance(accountId);

    expect(result).toBe(mockBalance);
  });

  it('should throw an error if getting the account fails', async () => {
    const accountId = 'acc_123';
    mockGet.mockResolvedValue({ success: false, error: { message: 'API Error' } });

    await expect(getAccountBalance(accountId)).rejects.toThrow(
      'Failed to retrieve account balance'
    );
  });
});
