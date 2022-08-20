const express = require("express");
const dotenv = require("dotenv"); 
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require('axios');

const bodyParser = require('body-parser')
const User = require("./models").User;

dotenv.config();

const app = express();

app.use(helmet());
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

const router = express.Router();

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  var decoded = jwt.decode(authHeader, { complete: true });
  if (
    decoded &&
    "payload" in decoded &&
    decoded.payload &&
    "username" in decoded.payload
  ) {
    let username = decoded.payload.username;
    let existingUser;
    try {
      existingUser = await User.findOne({
        where: {
          username: username,
        },
      });
    } catch {
      const err = new Error("Not authorized.");
      err.status = 400;
      return next(err);
    }

    jwt.verify(authHeader, existingUser.token, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
       next();
    });
  } else {
    const err = new Error("Not authorized.");
    err.status = 400;
    return next(err);
  }
}


router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({
      where: {
        username: username,
      },
    });
  } catch {
    const error = new Error("Error! Something went wrong.");
    err.status = 500;
    return next(error);
  }
  const checkPassword = await bcrypt.compareSync(
    password,
    existingUser.password
  );
  if (checkPassword) {
    let signedToken;
    try {
      signedToken = jwt.sign(
        {
          username: existingUser.username,
        },
        existingUser.token,
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new Error("Error! Something went wrong.");
      err.status = 500;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: {
        userId: existingUser.id,
        username: existingUser.username,
        token: signedToken,
      },
    });
  } else {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
});



router.get("/recruitment-position", authenticateToken, async (req, res, next) => {
    const reqParams = req.query;
    let urlParams = "?";
    if('page' in reqParams) {
        urlParams += `page=${reqParams["page"]}`
    }
    const request = axios.get("http://dev3.dansmultipro.co.id/api/recruitment/positions.json"+urlParams);
    request.then((resp) => {
    return res.status(200).json({
        success: true,
        data: resp.data
      });
   }).catch(() => {
    return res.status(500).json({
        success: false
    })
   })
});
 

router.get("/recruitment-position/search", authenticateToken, async (req, res, next) => {
    const reqParams = req.query;
    let urlParams = "?";
   
    if("description" in reqParams) {
        urlParams += `description=${encodeURIComponent(reqParams["description"])}`;
    }
    if("location" in reqParams) {
        if(urlParams[urlParams.length - 1] != "?") {
            urlParams += "&"
        }
        urlParams += `location=${encodeURIComponent(reqParams["location"])}`;
    }
    if("full_time" in reqParams) {
        if(urlParams[urlParams.length - 1] != "?") {
            urlParams += "&"
        }
        if(reqParams["full_time"]){
            urlParams += `type=${encodeURIComponent("Full Time")}`;
        }
    }
    if("page" in reqParams) {
        if(urlParams[urlParams.length - 1] != "?") {
            urlParams += "&"
        } 
        urlParams += `page=${reqParams["page"]}`;
    }
    console.log("http://dev3.dansmultipro.co.id/api/recruitment/positions.json"+urlParams);
    const request = axios.get("http://dev3.dansmultipro.co.id/api/recruitment/positions.json"+urlParams);
    request.then((resp) => {
    return res.status(200).json({
        success: true,
        data: resp.data
      });
   }).catch(() => {
    return res.status(500).json({
        success: false
    })
   })
});

router.get("/recruitment-position/:id", authenticateToken, async (req, res, next) => {
    const request = axios.get(`http://dev3.dansmultipro.co.id/api/recruitment/positions/${reqParams["id"]}`);
    request.then((resp) => {
    return res.status(200).json({
        success: true,
        data: resp.data
      });
   }).catch(() => {
    return res.status(500).json({
        success: false
    })
   })
});

app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at https://localhost:${process.env.PORT}`
  );
});
