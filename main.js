
//loading the data
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
        showNotification(currentNotifIndex)
        showBalance(currentUserId)
        
        
    } catch (error) {

        console.error('Error loading data:', error)

    }
}
loaddata()


//loading notification

let currentNotifIndex = 0
const notifContainer = document.getElementById("Notification-container")

function showNotification(index) {
  const notifications = apiData.notifications

  if (!notifications || notifications.length === 0) {
    notifContainer.innerHTML = `<p class="text-gray-500">Aucune notification disponible.</p>`;
    return;
  }

  const notif = notifications[index]

  notifContainer.innerHTML = `
  
    <div class="pr-2 pt-1"><i class="fa-solid fa-circle-exclamation"></i></div>
                <div class="flex flex-col  text-[#4B5563] ">
                    <p class="">${notif.title}</p>
                    <p class="">${notif.message}</p>

                </div>
  `;
}

function btnNotification() {
  const notifications = apiData.notifications
  if (!notifications || notifications.length === 0) return

  currentNotifIndex = (currentNotifIndex + 1) % notifications.length
  showNotification(currentNotifIndex)
}



// load data in dashboard

//solde conge
let currentUserId = 1
const soldeContainer = document.getElementById("soldeContainer")
const demandeContainer = document.getElementById("demandeContainer")

function showBalance(userId = currentUserId){

    const balance = apiData.congeBalance

    if (!balance || balance.length === 0) {
    soldeContainer.innerHTML = `<p class="text-gray-500">Aucun solde trouvé.</p>`;
    return;
  }

    const userBalance = balance.find(item => parseInt(item.userId) === parseInt(userId))

    

    if (!userBalance) {
    soldeContainer.innerHTML = `
                        <p>0</p>
                        <p>0</p>
                        <p>0</p>
                    `
    return;
    }

    const remainingPaidLeave = userBalance.paidLeave - userBalance.consumed.paidLeave
    const remainingRtt = userBalance.rtt - userBalance.consumed.rtt
    const remainingSick = userBalance.sick - userBalance.consumed.sick

    soldeContainer.innerHTML =`<div id="demandeContainer" class="flex flex-col gap-2 font-medium text-gray-900">
                        <p>${remainingPaidLeave} Jours</p>
                        <p>${remainingRtt} Jours</p>
                        <p>${remainingSick} Jours</p>
                    </div>`
  

}



// demande conge




