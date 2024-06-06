class PayloadCreator{
    payloadStructure = {};

    constructor(action,id,callerId,score){
        this.#create(action,id,callerId,score);
    }

    #create(action,id,callerId,score){
        this.payloadStructure = {
            fromService: 'image',
            action: action,
            value:{
                imageId: id,
                callerId,
                score,
            },
        };
    }

    getPayload(){
        return this.payloadStructure;
    }
}

module.exports = PayloadCreator;
