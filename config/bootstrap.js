/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {
  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  console.log('Loading bootstrap...')

  if (process.env.NODE_ENV === 'test') {

  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('CREATING DATABASE INDEX BY HAND');
    // USER MODEL
    var db = Products.getDatastore().manager;
    await db.collection(Products.tableName).createIndex({
      nameEnglish: 'text',
      descriptionEnglish: 'text'
    });
    // await db.collection(User.tableName).createIndex( { username: 1 }, {unique: true} );
    // PANDA MODEL
    // db = Panda.getDatastore().manager;
    // await db.collection(Panda.tableName).createIndex( { name: 1 }, {unique: true} );
  }

  // await initializeDatabase() // custom DB initialization...

  // return done();
};
