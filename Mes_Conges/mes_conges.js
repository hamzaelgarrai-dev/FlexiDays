let currentUserId = 1


let apiData = {}
const endpoints = [
    { url: 'http://localhost:3000/users', key: 'users' },
    { url: 'http://localhost:3000/notifications', key: 'notifications' },
    { url: 'http://localhost:3000/leaveBalances', key: 'congeBalance' },
    { url: 'http://localhost:3000/requests', key: 'requests' },
    { url: 'http://localhost:3000/settings', key: 'settings' },
    { url: 'http://localhost:3000/statistics', key: 'statistics' }
];

const loaddata = async () => {
    try {

        const promises = endpoints.map(endpoint => axios.get(endpoint.url))
        const results = await Promise.all(promises)
        results.forEach((result, index) => {
            const key = endpoints[index].key
            apiData[key] = result.data
        });
    
        
        
        
    } catch (error) {

        console.error('Error loading data:', error)

    }
}
loaddata()