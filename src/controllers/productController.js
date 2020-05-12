'use strict';

const ValidationContract = require('../validators/validator');
const repository = require('../repositories/product-repository');
const config = require('../config');
const guid = require('guid');
const azure = require('azure-storage');

exports.get = async (req, res, next) => {
    try{
        let data = await repository.get();
        res.status(200).send( data );
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    };
}

exports.getBySlug = async (req, res, next) => {
    try{
        let data = await repository.getBySlug(req.params.slug);
        res.status(200).send( data );
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
}

exports.getById = async (req, res, next) => {
    try{
        let data = await repository.getById(req.params.id);
        res.status(200).send( data );
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
}

exports.getByTag = async (req, res, next) => {
    try{
        let data = await repository.getByTag(req.params.tag)
        res.status(200).send( data );
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
}

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{

        const blobSvc = azure.createBlobService(config.userImagesBlobConnectionString);

        let filename    = guid.raw().toString() + ".jpg";
        let rawdata     = req.body.image;
        let matches     = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type        = matches[1];
        let buffer      = new Buffer.from(matches[2], 'base64');

        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png';
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://nodestr1.blob.core.windows.net/product-images/' + filename
        });
        res.status(200).send({ message: "Produto cadastrado com sucesso!" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
    
}

exports.put = async (req, res, next) => {
    try{
        await repository.update(req.params.id, req.body);
        res.status(201).send({ message: "Produto atualizado com sucesso!" });
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
}

exports.delete = async (req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({ message: "Produto removido com sucesso!" });
    } catch (e) {
        res.status(500).send({ message: "Não foi possível processar requisição" });
    }
}