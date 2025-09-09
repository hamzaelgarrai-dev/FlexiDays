const notifContainer = document.getElementById("Notification-container")

const endpoints = [
  { url: 'http://localhost:3000/users', key: 'users' },
  { url: 'http://localhost:3000/notifications', key: 'notifications' },
  { url: 'http://localhost:3000/leaveBalances', key: 'congeBalance' },
  { url: 'http://localhost:3000/requests', key: 'requests' },
  { url: 'http://localhost:3000/settings', key: 'settings' },
  { url: 'http://localhost:3000/statistics', key: 'statistics' }
];

const loaddata = async ()=>{
    try {

        const promises = endpoints.map(endpoint => axios.get(endpoint.url))
        const results = await Promise.all(promises)
         results.forEach((result, index) => {
         const key = endpoints[index].key;
          console.log(`Data for ${key}:`, result.data);
          
    });
    } catch (error) {

        console.error('Error loading data:', error)
        
    }
}
loaddata()

function btnNotification(){

    notifContainer.innerHTML = `

                <div class="pr-2 pt-1"><i class="fa-solid fa-circle-exclamation"></i></div>
                <div class="flex flex-col  text-[#4B5563] ">
                    <p class="">Fermeture exceptionnelle</p>
                    <p class="">Les bureaux seront fermés le 15 mars 2025 pour maintenance. Planifiez vos congés en conséquence.</p>

                </div>
    
    
    `

}
