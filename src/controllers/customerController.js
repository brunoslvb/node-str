'use strict';

const ValidationContract    = require('../validators/validator');
const repository            = require('../repositories/customer-repository');
const md5                   = require('md5');
const authService   = require('../services/auth-service');
// const mailService           = require('../services/mail-service');

exports.get = async (req, res, next) => {
    try{
        let data = await repository.get();
        res.status(200).send(data);
    } catch(e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    } 
}

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        });

        // let response = await mailService.send(req.body.email, "Este é o corpo do e-mail.", "Seja bem vindo!").then(data => {

        res.status(200).send({ message: "Cliente cadastrado com sucesso!" });
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
    
}

exports.authenticate = async (req, res, next) => {

    try{
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        console.log(customer);

        if(!customer){
            res.status(404).send({
                message: "Usuário ou senha inválidos."
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
    
}

exports.refreshToken = async (req, res, next) => {

    try{

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        console.log(customer);

        if(!customer){
            res.status(404).send({
                message: "Cliente não encontrado"
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: tokenData,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
    
}