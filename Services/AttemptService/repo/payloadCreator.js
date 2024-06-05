class PayloadCreator{
    payloadStructure = {};

    constructor(action,id,targetImageId,image){
        this.#create(action,id,targetImageId,image);
    }

    #create(action,id,targetImageId,image){
        this.payloadStructure = {
            fromService: 'attempt',
            action: action,
            value:{
                id,
                targetImageId,
                content: image,
            },
        };
    }
    getPayload(){
        return this.payloadStructure;
    }
}

module.exports = PayloadCreator;
