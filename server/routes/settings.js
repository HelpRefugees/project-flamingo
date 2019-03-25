const { Router } = require("express");

const { ensureLoggedIn, ensureHasRole } = require("../auth");

module.exports = db => {
  const collection = "settings";
  const router = new Router();

  router.get("/demo-info", ensureLoggedIn, async (req, res) => {
    const demographicInfo = await db.collection(collection).findOne(
      { name: "demographicInfo" },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          values: 1
        }
      }
    );

    res.json(demographicInfo);
  });

  router.post(
    "/demo-info",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const demographicInfo = await db
        .collection(collection)
        .findOne({ name: "demographicInfo" });
      demographicInfo.values.push(req.body.name);
      db.collection(collection).replaceOne(
        { name: "demographicInfo" },
        demographicInfo,
        () => {
          return res.send(demographicInfo);
        }
      );
    }
  );

  router.delete(
    "/demo-info/:name",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let demographicInfo = await db
        .collection(collection)
        .findOne({ name: "demographicInfo" });
      demographicInfo.values = demographicInfo.values.filter(
        name => name != req.params.name
      );
      db.collection(collection).replaceOne(
        { name: "demographicInfo" },
        demographicInfo,
        () => {
          res.send(demographicInfo);
        }
      );
    }
  );

  router.get("/countries-regions", ensureLoggedIn, async (req, res) => {
    const countriesAndRegions = await db.collection(collection).findOne(
      { name: "countriesAndRegions" },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          values: 1
        }
      }
    );

    res.json(countriesAndRegions);
  });

  router.post(
    "/countries-regions",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      const countriesAndRegions = await db
        .collection(collection)
        .findOne({ name: "countriesAndRegions" });
      countriesAndRegions.values.push({
        country: req.body.country,
        regions: []
      });
      db.collection(collection).replaceOne(
        { name: "countriesAndRegions" },
        countriesAndRegions,
        () => {
          return res.send(countriesAndRegions);
        }
      );
    }
  );

  router.delete(
    "/countries/:country",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let countriesAndRegions = await db
        .collection(collection)
        .findOne({ name: "countriesAndRegions" });
      countriesAndRegions.values = countriesAndRegions.values.filter(
        country => country.country != req.params.country
      );
      db.collection(collection).replaceOne(
        { name: "countriesAndRegions" },
        countriesAndRegions,
        () => {
          res.send(countriesAndRegions.values);
        }
      );
    }
  );

  // add region
  router.post(
    "/regions",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let countriesAndRegions = await db
        .collection(collection)
        .findOne({ name: "countriesAndRegions" });
      countriesAndRegions.values.map(country => {
        if (country.country === req.body.country) {
          return country.regions.push(req.body.region);
        } else {
          return country;
        }
      });
      db.collection(collection).replaceOne(
        { name: "countriesAndRegions" },
        countriesAndRegions,
        () => {
          return res.send(countriesAndRegions);
        }
      );
    }
  );

  // delete region
  router.delete(
    "/regions",
    ensureLoggedIn,
    ensureHasRole("help-refugees"),
    async (req, res) => {
      let countriesAndRegions = await db
        .collection(collection)
        .findOne({ name: "countriesAndRegions" });

      countriesAndRegions.values = countriesAndRegions.values.filter(
        country => {
          if (country.country === req.body.country) {
            let newCountry = country;
            newCountry.regions = country.regions.filter(
              region => region != req.body.region
            );
            return newCountry;
          } else {
            return country;
          }
        }
      );
      db.collection(collection).replaceOne(
        { name: "countriesAndRegions" },
        countriesAndRegions,
        () => {
          res.send(countriesAndRegions.values);
        }
      );
    }
  );

  return router;
};
