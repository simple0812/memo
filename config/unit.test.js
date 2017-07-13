//测试src文件夹下所有.spec.js文件
const testsContext = require.context('../src', true, /\.spec$/)
testsContext.keys().forEach(testsContext)