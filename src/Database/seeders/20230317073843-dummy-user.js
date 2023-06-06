import hashPassword from '../../utils/user.util';
/**
 * @param {data} hashedPassword .
 * @returns {data} .
 */
const hashedPassword = hashPassword('dummypassword');
/**
 * @param {data} queryInterface .
 * @returns {data} .
 */
export async function up(queryInterface) {
  return queryInterface.bulkInsert('Dummy', [
    {
      names: 'Dummy User',
      email: 'dummy@email.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
/**
 * @param {data} .
 * @returns {data} .
 */
export async function down() {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
