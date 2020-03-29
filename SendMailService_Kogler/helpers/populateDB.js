const hashTools = require('./hashTools');

module.exports = async models => {
  /*******************************************************/
  try {
    let hashedPassword = await hashTools.createHash('Ee8cJT4LR7uGJks');

    let users = await models.User.findAll();

    if (users && users.length > 0) {
      return;
    }

    let adminRole = await models.Role.create({
      name: "Admin",
      shortName: "A"
    });
/*
    let userRole = await models.Role.create({
      name: "Users",
      shortName: "U"
    });*/


    let aichnerc = await models.User.build({
      firstname: "Christian",
      lastname: "Aichner",
      email: "test@test.com",
      username: "aichnerc",
      password: hashedPassword
    });

    await aichnerc.setRole(adminRole, { save: false });
    await aichnerc.save();

    let roleusers = await adminRole.getUsers();

    users = await models.User.findAll();

    users.forEach(async u => {
      let role = await u.getRole();
      let roleName = role.name;
      let rn = (await u.getRole()).name;
      console.log(`${u.username} ${(await u.getRole()).name}`);
    });
  } catch (error) {
    console.log(error);
  }
};
