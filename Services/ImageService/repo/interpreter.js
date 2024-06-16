class Interpreter{
    constructor(payload, repo){
        this.payload = payload;
        this.repo = repo;
    }

    async interpret(){ return new Promise((resolve, reject) => {
            try{
                this.#action();
                resolve('interpret message from broker was succesfully processed');
            }catch(err){
                reject(err);
            }
        });
    }

    #action() { return new Promise((resolve, reject) => {
        try {
            resolve(this.repo[this.payload.action](this.payload));
        } catch (err) {
            reject(err);
        }
    });
    }
}

module.exports = Interpreter;
