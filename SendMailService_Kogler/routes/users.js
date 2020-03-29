const express = require("express");
const router = express.Router();

const models = require("../models");
const hashTools = require("../helpers/hashTools");

const routes = () => {
  const passportOptions = { session: false, failWithError: true };

  /* GET users listing. */
  router.get("/", async (req, res, next) => {
    try {
      if (req.query.lastname) {
        responseUsers = await models.User.findAll({
          where: { lastname: req.query.lastname }
        });
      } else {
        responseUsers = await models.User.findAll();
      }
      res.json(responseUsers);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      let id = parseInt(req.params.id);

      let user = await models.User.findById(id);

      if (user) {
        res.json(user);
      } else {
        next({ id: id, message: "user not found", status: 404 });
      }
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const newPassword = await hashTools.createHash("change_me_soon");

      let role = await models.Role.findByPk(1);

      let newUser = await models.User.build({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: newPassword
      });

      await newUser.setRole(role, { save: false });
      await newUser.save();

      res.json({ id: newUser.id, message: "user created" });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      let id = parseInt(req.params.id);
      let user = await models.User.findById(id);

      if (user) {
        await user.update({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          username: req.body.username
        });
        res.json({ id: id, message: "updated" });
      } else {
        next({ id: id, message: "user not found", status: 404 });
      }
    } catch (error) {
      next(error);
    }
  });

  /**
   *
   */
  router.delete("/:id", async (req, res, next) => {
    try {
      let id = parseInt(req.params.id);

      let user = await models.User.findById(id);

      if (user) {
        user.destroy();
        res.json({ id: id, message: "deleted" });
      } else {
        next({ id: id, message: "user not found", status: 404 });
      }
    } catch (error) {
      next(error);
    }
  });
  return router;
};

module.exports = routes;
