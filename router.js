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


module.exports = () => {
    return [
        {
            'method': 'get',
            'path': '/',
            'action': 'HomeController.index'
        },
        {
            'method': 'post',
            'path': '/',
            'action': 'HomeController.test'
        },
    ]
}
