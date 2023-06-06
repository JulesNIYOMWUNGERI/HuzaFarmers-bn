import asyncWrapper from '../utils/handlingTryCatchBlocks';

const RoleCheck = (acceptedRoles) => asyncWrapper((req, res, next) => {
  const { userRole } = req;
  if (acceptedRoles.includes(userRole.name)) {
    next();
  } else {
    return res.status(401).json({
      status: 401,
      message: 'you are not allowed to access this collection, only merchant is accepted',
    });
  }
});

export default RoleCheck;
