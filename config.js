module.exports = function () {
    switch(process.env.NODE_ENV){
        case 'development':
            return {
                value:'in dev env'
            };

        case 'production':
            return {
                value: 'in prod env'
            };

        case 'test':
            return {};

        default:
            return 'Invalid environment';
    }
};
