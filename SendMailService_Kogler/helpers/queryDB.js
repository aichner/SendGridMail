module.exports = async models => {
  /*******************************************************/
  try {
    /**
     * find all users
     */
    let users = await models.User.findAll();

    for (let user of users) {
      showUser(user);
    }

    /**
     * find one user by id
     */
    let userById = await models.User.findById(1);
    showUser(userById);
    

    /**
     * find users with given username, return first hit
     */
    let userByUsername = await models.User.findOne({
      where: { username: "john" }
    });
    showUser(userByUsername);

    /**
     * find all users with a given lastname
     */
    let usersBylastname = await models.User.findAll({
      where: { lastname: "Doe" }
    });

    for (let user of usersBylastname) {
      showUser(user);
    }

    /**
     * find all users, access role attributes via lazy loading
     */
    for (let user of await models.User.findAll()) {
      // for each user we have to retrieve the role -> n users, n + 1 select statememts
      let role = await user.getRole();
      console.log(`${user.firstname} ${user.lastname} ${role.name}`);
    }

    /**
     * the same via eager loading load roles in the same statement
     */
    let usersWithRole = await models.User.findAll({
      include: [{ model: models.Role }]
    });

    for (let user of usersWithRole) {
      console.log(`${user.firstname} ${user.lastname} ${user.Role.name}`);
    }

    /**
     * fine one role via id
     */
    let role = await models.Role.findById(1);

    /**
     * count all roles
     */
    let usersCount = await role.countUsers();
    console.log(`role ${role.name} has ${usersCount} users`);

    let roleUsers = await role.getUsers();

    for (user of roleUsers) {
      showUser(user);
    }
  } catch (error) {
    console.log(error);
  }
};

const showUser = user => {
  if (user) {
    console.log(`${user.username}: ${user.firstname} ${user.lastname}`);
  } else {
    console.log("no user found");
  }
};
