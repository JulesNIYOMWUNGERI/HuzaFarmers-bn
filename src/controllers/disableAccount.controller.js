import { User } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const update = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  User.update(req.body, {
    where: { id },
  }).then((num) => {
    if (num == 1) {
      res.send({
        message: 'User is disabled successfully.',
      });
    } else {
      res.status(404).send({
        message: `Cannot disable an account with id=${id}. User was not found !`,
      });
    }
  });
});

export default update;
