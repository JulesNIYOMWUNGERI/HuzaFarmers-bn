// handling try catch block function
const asyncWrapper = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.errors ? err.errors[0].message : err.message,
    });
  }
};

export default asyncWrapper;
