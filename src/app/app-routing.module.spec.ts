import { AppRouting } from './app.routing';

describe('AppRouting', () => {
  let appRoutingModule: AppRouting;

  beforeEach(() => {
    appRoutingModule = new AppRouting();
  });

  it('should create an instance', () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
