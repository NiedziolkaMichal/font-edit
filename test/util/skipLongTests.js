const LONG_TESTS_REGEX = /^[\s\S]+\.long\.test\.ts$/;

module.exports = (testPaths) => {
  return {
    filtered: testPaths.filter((p) => !LONG_TESTS_REGEX.test(p)).map((test) => ({ test })),
  };
};
