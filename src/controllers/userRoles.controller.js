import db from '../Database/models';
import ROLES_LIST from '../utils/userRoles.util';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { User } = db;
export const addUserPermissions = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { Permission: newPermission } = req.body;
  const existingUser = await User.findByPk(id);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (!newPermission) {
    return res.status(400).json({ message: 'Permission can not be empty' });
  }
  const existingRole = JSON.parse(existingUser.role);
  const index = existingRole.permissions.indexOf(newPermission);
  if (index > -1) {
    return res
      .status(409)
      .json({ message: 'User already has this permission' });
  }
  existingRole.permissions.push(newPermission);
  existingUser.role = JSON.stringify(existingRole);
  await existingUser.save();
  return res.status(200).json({ message: 'Permission added successfully' });
});
export const RemoveUserPermissions = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { Permission: permission } = req.body;
  const existingUser = await User.findByPk(id);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (!permission) {
    return res.status(400).json({
      message: 'permission field can not be empty',
    });
  }
  const existingRole = JSON.parse(existingUser.role);
  const index = existingRole.permissions.indexOf(permission);
  if (index > -1) {
    existingRole.permissions.splice(index, 1);
  } else {
    return res
      .status(404)
      .json({ message: 'The user does not have this permission' });
  }
  existingUser.role = JSON.stringify(existingRole);
  await existingUser.save();
  return res.status(200).json({ message: 'Permission removed successfully' });
});

export const changeUserRole = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { role: newRole } = req.body;
  const existingUser = await User.findByPk(id);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  let userRole;
  if (!newRole) {
    return res.status(400).json({ message: 'role field can not be empty' });
  }
  const allowedRoles = ['admin', 'merchant', 'customer'];
  if (allowedRoles.includes(newRole.toLowerCase())) {
    userRole = newRole.toLowerCase();
  }

  const updatedRole = ROLES_LIST[userRole];
  if (!updatedRole) {
    return res.status(422).json({ message: 'Invalid role' });
  }
  if (JSON.stringify(updatedRole) === existingUser.role) {
    return res
      .status(409)
      .json({ message: 'Conflict - User already has this role' });
  }
  existingUser.role = JSON.stringify(updatedRole);
  await existingUser.save();

  return res.status(200).json({ message: 'User role updated successfully' });
});
