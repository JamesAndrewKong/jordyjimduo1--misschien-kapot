class PayloadCreator{
    payloadStructure = {};

    constructor(action,id){
        this.#create(action,id);
    }

    #create(action,id){
        this.payloadStructure = {
            fromService: 'user',
            action: action,
            value:{
                id,
            },
        };
    }

    getPayload(){
        return this.payloadStructure;
    }
}

module.exports = PayloadCreator;
