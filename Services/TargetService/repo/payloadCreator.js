class PayloadCreator{
    payloadStructure = {};

    constructor(action, id, image){
        this.#create(action, id, image);
    }

    #create(action, id, image){
        this.payloadStructure = {
            fromService: 'target',
            action: action,
            value:{
                id,
                content: image,
            },
        };
    }

    getPayload(){
        return this.payloadStructure;
    }
}

module.exports = PayloadCreator;
