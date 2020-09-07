import Controller from './controller';
import { Response } from 'express';
import { Request } from 'express';
import { param,check, validationResult, cookie } from 'express-validator';
import { wrap } from '../util/wrapper';
import { deleteToken,createToken } from '../models/login/login-models';
import { Login } from './../models/login/login';
// const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

const jwt=require ('jsonwebtoken');
const jwte = require('express-jwt');
const blacklist = require('express-jwt-blacklist');

app.use(express.json())

class LoginController extends Controller {
    public path = '/login';
    public idPrefix: string = '/:id';
  
    constructor() {
      super();
      this.initializeRoutes();
    }
    public initializeRoutes(): void {
        this.router.get(
          '/logout',
         // [check('token').isString()],
          this.deleteToken
        );

        this.router.get(
          this.path + '/authorization',
          [check('token').isString()],
          this.authorization
        )
        
        this.router.post(
            this.path,
            [check('user_name').isString() && check('pass').isString()],
            this.getUser
          );
        }   

        getUser = async (req: Request, res: Response) => {
            try {
              let user_name: string = req.body.user_name;
              let pass: string = req.body.pass;
              let token = await createToken(user_name,pass);
              return res.json([{token:token}]);
            } catch (err) {
              res.status(500).json({ errors: err.detail });
            }
          };

        authorization = async (req: Request, res: Response) => {
          try{
            let authHeader = req.headers['authorization'];
            let token = authHeader && authHeader.split(' ')[1];
            if(token == null) return res.sendStatus(401);

            jwt.verify(token, process.env.ACCESS_TOKEN, (err: any,userAuth: any) => {
              if(err) return res.sendStatus(403);
              res.json({userAuth});
            })

          } catch(err) {
            res.status(500).json({errors: err.detail});
          }
        }

        deleteToken = async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(404).json({ errors: errors.array() });
            }
            let authHeader = req.headers['authorization'];
            let token = authHeader && authHeader.split(' ')[1];
            if(token == null) return res.sendStatus(401);
            blacklist.revoke(token);
            res.json({success:true,message:"You have been successfully logged out"})
          };

}

export default LoginController;