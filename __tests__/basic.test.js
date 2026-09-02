describe('Basic test setup', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should have test environment variables', () => {
    expect(global.IS_TEST).toBe(true);
  });

  it('should have mocked window object', () => {
    expect(global.window).toBeDefined();
    expect(typeof global.window.requestAnimationFrame).toBe('function');
  });
}); 