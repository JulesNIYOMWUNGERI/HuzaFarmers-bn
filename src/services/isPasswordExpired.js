import moment from 'moment';
import { Sequelize } from 'sequelize';
import { User } from '../Database/models';
import eventEmitter from '../events/passwordEventEmit';
import 'dotenv/config';

const passwordExipiration = async () => {
  const isPasswordExpired = await User.findAll({
    where: {
      lastTimePasswordUpdate: {
        [Sequelize.Op.lt]: moment().subtract(
          process.env.EXPIREDIN,
          process.env.TIMEUNITS
        ),
      },
      isExpired: false,
    },
  });
  if (isPasswordExpired.length > 0) {
    User.update(
      { isExpired: true },
      {
        where: {
          lastTimePasswordUpdate: {
            [Sequelize.Op.lt]: moment().subtract(
              process.env.EXPIREDIN,
              process.env.TIMEUNITS
            ),
          },
        },
      }
    );
    eventEmitter.emit(
      'password_expiration',
      'Password is expired you have to change password'
    );
  } else {
    eventEmitter.emit('noExpiredPassword', 'No expired password');
  }
};
export default passwordExipiration;
