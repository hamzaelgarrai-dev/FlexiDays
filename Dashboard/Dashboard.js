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
        showNotification(currentNotifIndex)
        showBalance(currentUserId)
        demandeStatus(currentUserId)
        
        
        
    } catch (error) {

        console.error('Error loading data:', error)

    }
}
loaddata()

// the dashbord page

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

  notifContainer.innerHTML = `<div class="pr-2 pt-1"><i class="fa-solid fa-circle-exclamation"></i></div>
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




const soldeContainer = document.getElementById("soldeContainer")


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

    soldeContainer.innerHTML =`<div id="demandeContainer" class="flex items-end flex-col gap-2 font-medium text-gray-900">
                        <p>${remainingPaidLeave} Jours</p>
                        <p>${remainingRtt} Jours</p>
                        <p>${remainingSick} Jours</p>
                    </div>`
  

}



// demande status

const demandeContainer = document.getElementById("demandeContainer");

function demandeStatus(userId = currentUserId) {
  const requests = apiData.requests;

  if (!requests || requests.length === 0) {
    demandeContainer.innerHTML = `
      <p>0</p>
      <p>0</p>
      <p>0</p>
    `;
    return;
  }

  // Filter requests for the current user
  const userRequests = requests.filter(req => req.userId === userId);

  // Count requests by status
  const pendingCount = userRequests.filter(req => req.status === "pending").length;
  const approvedCount = userRequests.filter(req => req.status === "approved").length;
  const rejectedCount = userRequests.filter(req => req.status === "rejected").length;

  // Populate the container
  demandeContainer.innerHTML = `
    <p>${pendingCount}</p>
    <p>${approvedCount}</p>
    <p>${rejectedCount}</p>
  `;
}