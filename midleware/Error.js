const errorHandler = (req, res) => {
  const statusCode = res.statusCode ?? 500;
  if (statusCode === 404) {
    return res.json({
      message: 'Not found',
      stack: null,
    });
  }
  if (statusCode === 401) {
    return res.json({
      message: 'Login invalid',
      stack: null,
    });
  }
  return res.status(500).json({
    message: 'Unhandle',
    stack: null,
  });
};

export { errorHandler };
