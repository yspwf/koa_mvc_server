// module.exports = [
//     {
//         'method': 'get',
//         'path': '/',
//         'action': 'HomeController.index'
//     },
//     {
//         'method': 'post',
//         'path': '/',
//         'action': 'HomeController.test'
//     },
// ];


module.exports = (middleware) => {
    const { auth, json } = middleware;
    return [
        {
            'method': 'get',
            'path': '/',
            'action': 'HomeController.index',
            'middleware': auth
        },
        {
            'method': 'post',
            'path': '/',
            'action': 'HomeController.test'
        },
    ]
}
