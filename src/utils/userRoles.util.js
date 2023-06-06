const ROLES_LIST = {
  admin: {
    name: 'admin',
    code: 5020,
    permissions: ['create', 'read', 'update', 'delete'],
  },
  farmer: {
    name: 'farmer',
    code: 5120,
    permissions: ['create', 'read', 'update'],
  },
  customer: {
    name: 'customer',
    code: 5220,
    permissions: ['read'],
  },
};

export default ROLES_LIST;
