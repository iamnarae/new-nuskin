
module.exports = {
	transpileDependencies: ['socket.io-client', 'engine.io-client' ],
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'prod' ? 'https://resource2018.nuskinkorea.co.kr/ContentsImages/prod/' : 'https://resource2018.nuskinkorea.co.kr/ContentsImages/test/',
}