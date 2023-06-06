/* eslint-disable linebreak-style */
/**
 * @param {data} queryInterface .
 * @returns {data} .
 */
export async function up(queryInterface) {
  return queryInterface.bulkInsert('Dummy', [
    {
      names: 'Dummy User',
      email: 'dummy@email.com',
      password: 'dummypassword',
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
