let MONGODB_URL = 'mongodb+srv://KimLe:kimle123@cluster0.c6nnpzt.mongodb.net/?retryWrites=true&w=majority';// declare a variable
let APIROOT_URL = 'http://localhost:3000/';

module.exports = {
    https: false,
    appname: 'ClothesShop.',
    port: process.env.PORT || 3000,
    url: APIROOT_URL,
    authenticationkey: 'myclothesshopisfamous',
    paths:{
        public: '/public',
        tmp: '/tmp',
        docs: '/docs',
        tag: '/tag'
    },
    mongodb: {
        uri: MONGODB_URL,
        username: ''
    }
}