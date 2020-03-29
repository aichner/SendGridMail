// ///////////////////////////////////////////////////////////////////////////
//
// sequelizedemo.js
//
// Demo code for the most important features of sequelize
//
// ///////////////////////////////////////////////////////////////////////////


const Sequelize = require('sequelize');


async function sequelizedemo() {

    try {

        // ///////////////////////////////////////////////////////////////////
        //
        // Sequelize initialization
        //
        // ///////////////////////////////////////////////////////////////////

        /*
        this.sequelize = new Sequelize('SequelizeDemo', 'SequelizeDemo', 'gehheim', {
            dialect: 'mysql',
            host: 'projects.htl-villach.at'
        });
        */
        this.sequelize = new Sequelize('SequelizeDemo', 'SequelizeDemo', 'gehheim', {
            dialect: 'sqlite',
            storage: 'database/database.sqlite'
        });

        // ///////////////////////////////////////////////////////////////////
        //
        // Sequelize Model definition
        //
        // ///////////////////////////////////////////////////////////////////

        let User = sequelize.define('users', {
            firstname: {
                type: Sequelize.STRING
            },
            lastname: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            }
        });

        let Message = sequelize.define('messages', {
            subject: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING
            },
            prio: {
                type: Sequelize.INTEGER
            }
        });

        User.hasMany(Message);
        Message.belongsTo(User);

        // ///////////////////////////////////////////////////////////////////
        //
        // Initialize the database (create the tables based on the model
        // definition(s))
        //
        // Note: { force: true } makes sure that all tables are dropped
        // and created from scratch.
        //
        // Good for development, bad for production.
        //
        // ///////////////////////////////////////////////////////////////////

        await sequelize.sync({force: true, logging: console.log});


        // ///////////////////////////////////////////////////////////////////
        //
        // create a few models and save them in the database
        //
        // ///////////////////////////////////////////////////////////////////

        // Variant A using Promises as per the sequelize documentation

        User.create({
            firstname: 'Marge',
            lastname: 'Simpson'
        }).then((user) => {
            console.log(user.firstname + " " + user.lastname + " created with id " + user.id);
        }).catch(error => {
            console.log(error);
        });

        // Variant B, using async/await, much easier to write and read.

        let homer = await User.create({
            firstname: 'Homer',
            lastname: 'Simpson'
        });

        await User.create({
            firstname: 'Sepp',
            lastname: 'Schnorcher'
        });

        // ///////////////////////////////////////////////////////////////////
        //
        // Create a new user save it later
        //
        // ///////////////////////////////////////////////////////////////////

        let donald = User.build({
            firstname: 'Donald',
            lastname: 'Duck'
        });

        await donald.save();

        console.log(`${donald.firstname} ${donald.lastname} ${donald.id}`);

        // ///////////////////////////////////////////////////////////////////
        //
        // Delete a user from the database
        //
        // ///////////////////////////////////////////////////////////////////

        donald.destroy();

        // ///////////////////////////////////////////////////////////////////
        //
        // Queries: find all users
        //
        // ///////////////////////////////////////////////////////////////////

        // Variant A using Promises as per the sequelize documentation

        User.findAll().then(users => {
            console.log('we have ' + users.length + ' users');
        }).catch(error => {
            console.log('we have users');
        });

        let users = await User.findAll();

        for (let user of users) {
            console.log(user.firstname + " " + user.lastname);
        }

        // ///////////////////////////////////////////////////////////////////
        //
        // Queries: find one user by its primary key
        //
        // ///////////////////////////////////////////////////////////////////

        let id = 1;

        let someUser = await User.findById(id);

        if (someUser) {
            console.log(someUser.firstname + " " + someUser.lastname);
        } else {
            console.log(`no user with id ${id}`)
        }

        // ///////////////////////////////////////////////////////////////////
        //
        // Queries: find all users by a where clause
        //
        // ///////////////////////////////////////////////////////////////////


        // where lastname = 'Simpson'

        let simpsons = await User.findAll({
            where: {
                lastname: 'Simpson'
            }
        });

        for (let user of simpsons) {
            console.log(user.firstname + " " + user.lastname);
        }

        // where firstname = 'Sepp' and lastname = 'Schnorcher'

        let resultUsers = await User.findAll({
            where: {
                firstname: 'Sepp',
                lastname: 'Schnorcher'
            }
        });

        // ///////////////////////////////////////////////////////////////////
        //
        // Queries: update an existing user
        //
        // ///////////////////////////////////////////////////////////////////

        if (resultUsers.length > 0) {
            let sepp = resultUsers[0];

            sepp.lastname = "Schoarcher";

            await sepp.save();
        }

        // ///////////////////////////////////////////////////////////////////
        //
        // Relationships: create a message for an user
        //
        // ///////////////////////////////////////////////////////////////////

        let user = await User.findById(1);

        // here we have two variants to attach a new message to an existing
        // user.
        // In a real project we probably use the one that generates less
        // SQL statements, so watch out.

        let buildAndSave = false;

        if (buildAndSave) {

            /////////////////////////////////////////////////////////////////
            //
            // create message in memory only
            //
            /////////////////////////////////////////////////////////////////
            let message = await Message.build({
                subject: "Demo Subject",
                content: "Demo Content",
                prio: 1
            });

            /////////////////////////////////////////////////////////////////
            //
            // set the user - implicit insert
            //
            /////////////////////////////////////////////////////////////////
            await message.setUser(user);

        } else {

            /////////////////////////////////////////////////////////////////
            //
            // create message in memory AND insert it into the database
            //
            /////////////////////////////////////////////////////////////////
            let message = await Message.create({
                subject: "Demo Subject",
                content: "Demo Content",
                prio: 1
            });

            /////////////////////////////////////////////////////////////////
            //
            // update message in the database
            //
            /////////////////////////////////////////////////////////////////
            await user.addMessage(message);
        }

        // ///////////////////////////////////////////////////////////////////
        //
        // Relationships: list all messages for an user
        //
        // ///////////////////////////////////////////////////////////////////

        let aUser = await User.findById(1);

        let messages = await aUser.getMessages();

        // ///////////////////////////////////////////////////////////////////
        //
        // Relationships: get the user for a message
        //
        // ///////////////////////////////////////////////////////////////////

        let message = await Message.findById(1);

        let messageUser = await message.getUser();

    } catch (error) {
        console.log(error);
    }
}

sequelizedemo();
