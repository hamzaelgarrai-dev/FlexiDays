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

        showBalance(currentUserId)
        demandeStatus(currentUserId)
        showCongeStatus(currentUserId)
    
        
        
        
    } catch (error) {

        console.error('Error loading data:', error)

    }
}
loaddata()




const soldeRestanrContainer = document.getElementById("soldeRestanrContainer")

function showBalance(userId = currentUserId){

    const balance = apiData.congeBalance

    if (!balance || balance.length === 0) {
    soldeRestanrContainer.innerHTML = `<p class="text-gray-500">Aucun solde trouvé.</p>`;
    return;
  }

    const userBalance = balance.find(item => parseInt(item.userId) === parseInt(userId))

    

    if (!userBalance) {
    soldeRestanrContainer.innerHTML = `
                        <div class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Solde restant</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">0</p>
                </div>
                    `
    return;
    }

    const remainingPaidLeave = userBalance.paidLeave - userBalance.consumed.paidLeave


    soldeRestanrContainer.innerHTML =`<div class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Solde restant</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">${remainingPaidLeave}</p>
                </div>`
  

}



const ApprovedContainer = document.getElementById("ApprovedContainer")
const AttenteContainer = document.getElementById("AttenteContainer")
const RefuseContainer = document.getElementById("RefuseContainer")

function demandeStatus(userId = currentUserId) {
  const requests = apiData.requests;

  if (!requests || requests.length === 0) {
    ApprovedContainer.innerHTML = `
      <div id="ApprovedContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Approuvées</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">0</p>
                </div>
    `;
    AttenteContainer.innerHTML = `<div id="AttenteContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">En attente</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">0</p>
                </div>`

    RefuseContainer.innerHTML = `<div id="RefuseContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Refusés</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">0</p>
                </div>`
    return;
  }

  // Filter requests for the current user
  const userRequests = requests.filter(req => req.userId === userId)

  // Count requests by status
  const pendingCount = userRequests.filter(req => req.status === "pending").length
  const approvedCount = userRequests.filter(req => req.status === "approved").length
  const rejectedCount = userRequests.filter(req => req.status === "rejected").length

  // Populate the container
  ApprovedContainer.innerHTML = `
    <div id="ApprovedContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Approuvées</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">${approvedCount}</p>
                </div>
  `;
  AttenteContainer.innerHTML = `<div id="AttenteContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">En attente</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">${pendingCount}</p>
                </div>`

RefuseContainer.innerHTML = `<div id="RefuseContainer" class="pl-4">
                    <p class="text-[var(--subHeading-color)] text-sm">Refusés</p>
                    <p class="text-[var(--heading-color)] text-xl font-semibold">${rejectedCount}</p>
                </div>`
 
}


const congeInfoContainer = document.getElementById("congeInfoContainer")

function showCongeStatus(userId = currentUserId){

    const requests = apiData.requests;


    const userRequests = requests.filter(req => parseInt(req.userId) === parseInt(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (userRequests.length === 0) {
    congeInfoContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center">
        <p>You dont have any request yet</p>
      </div>`;
    return;
  }



    // 3. Clear the container before adding new cards
  congeInfoContainer.innerHTML = "";

  // 4. Loop through all requests and create a card for each
  userRequests.forEach(request => {
    const { type, startDate, endDate, days, status } = request;

    // Define status color
    let statusColor = "";
    if (status === "pending") {
      statusColor = "bg-[#FACC15]/40 text-yellow-800";
      const card = document.createElement("div");

    card.innerHTML = `

        <div class="conge-info  flex-col w-full justify-between h-40 rounded-2xl bg-white mb-10 shadow-md">

            <div class="flex items-center  ">
                <h2 class="p-4 pl-6 text-lg font-semibold text-gray-800">${type}</h2>
                <div
                    class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl h-7 flex items-center justify-center gap-x-2">
                    <i class="fa-solid fa-clock"></i>
                    ${status}
                </div>

            </div>



            <div class="w-250 px-6 mx-auto flex justify-between items-center">

                <div class="flex flex-col items-start text-center w-48">
                    <p class="text-gray-700">Du ${startDate}</p>
                    <p class="text-gray-700">Au ${endDate}</p>
                </div>
                <div class="flex flex-col items-start text-center w-24">
                    <p class="text-gray-500">Durée</p>
                    <p class="text-gray-500">${days}</p>
                </div>

                <div class="flex flex-col items-start text-center w-32">
                    <p class="text-gray-500">Type</p>
                    <p class="text-gray-500">${type}</p>
                </div>
                <div class="btn-div flex flex-col text-center space-y-2 w-46 items-end">

                    <button
                        data-id="${request.id}" class="btn-edit w-28 h-9 rounded-xl flex items-center justify-center bg-[var(--btnEdit-color)] text-white text-sm cursor-pointer shadow-sm gap-1">
                        <i class="fa-solid fa-pen-to-square"></i>
                        Modifier
                    </button>

                    <button
                        data-id="${request.id}" class="btn-delete w-28 h-9 rounded-xl flex items-center justify-center bg-[var(--btnCancel-color)] text-gray-800 text-sm cursor-pointer border border-gray-300 gap-1">
                        <i class="fa-solid fa-trash"></i>
                        Annuler
                    </button>

                </div>

            </div>


        </div>
     
    `;
    congeInfoContainer.appendChild(card)
    } else if (status === "approved") {
      statusColor = "bg-[#22C55E]/40 text-green-800";
      const card = document.createElement("div");

    card.innerHTML = `

        <div class="conge-info  flex-col w-full justify-between h-40 rounded-2xl bg-white mb-10 shadow-md">

            <div class="flex items-center  ">
                <h2 class="p-4 pl-6 text-lg font-semibold text-gray-800">${type}</h2>
                <div
                    class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl h-7 flex items-center justify-center gap-x-2">
                    <i class="fa-solid fa-check"></i>
                    ${status}
                </div>

            </div>



            <div class="w-250 px-6 mx-auto flex justify-between items-center">

                <div class="flex flex-col items-start text-center w-48">
                    <p class="text-gray-700">Du ${startDate}</p>
                    <p class="text-gray-700">Au ${endDate}</p>
                </div>
                <div class="flex flex-col items-start text-center w-24">
                    <p class="text-gray-500">Durée</p>
                    <p class="text-gray-500">${days}</p>
                </div>

                <div class="flex flex-col items-start text-center w-32">
                    <p class="text-gray-500">Type</p>
                    <p class="text-gray-500">${type}</p>
                </div>
                <div class="btn-div flex flex-col text-center space-y-2 w-46 items-end">
                    <p>Approuvé par Jean Martin</p>
                </div>

            </div>


        </div>
     
    `;
    congeInfoContainer.appendChild(card)
    } else {
      statusColor = "bg-[#EF4444]/40 text-red-800";
      const card = document.createElement("div");

    card.innerHTML = `

        <div class="conge-info  flex-col w-full justify-between h-40 rounded-2xl bg-white mb-10 shadow-md">

            <div class="flex items-center  ">
                <h2 class="p-4 pl-6 text-lg font-semibold text-gray-800">${type}</h2>
                <div
                    class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl h-7 flex items-center justify-center gap-x-2">
                    <i class="fa-solid fa-circle-xmark"></i>
                    ${status}
                </div>

            </div>



            <div class="w-250 px-6 mx-auto flex justify-between items-center">

                <div class="flex flex-col items-start text-center w-48">
                    <p class="text-gray-700">Du ${startDate}</p>
                    <p class="text-gray-700">Au ${endDate}</p>
                </div>
                <div class="flex flex-col items-start text-center w-24">
                    <p class="text-gray-500">Durée</p>
                    <p class="text-gray-500">${days}</p>
                </div>

                <div class="flex flex-col items-start text-center w-32">
                    <p class="text-gray-500">Type</p>
                    <p class="text-gray-500">${type}</p>
                </div>
                <div class="btn-div flex flex-col text-center space-y-2 w-46 items-end">
                    <p>Refuse par Jean Martin</p>
                </div>

            </div>


        </div>
     
    `;
    congeInfoContainer.appendChild(card)
    }

    


        


})}



//btn Annuler

document.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".btn-delete")
  if (!deleteBtn) return

  const requestId = deleteBtn.getAttribute("data-id");

  if (!requestId) return

  const confirmDelete = confirm("Voulez-vous vraiment supprimer cette demande ?")
  if (!confirmDelete) return

  try {
    await axios.delete(`http://localhost:3000/requests/${requestId}`)
    alert("Demande supprimée avec succès !")
    
   
    showCongeStatus(currentUserId)

  } catch (error) {
    console.error("Erreur lors de la suppression :", error)
    alert("Une erreur est survenue lors de la suppression.")
  }
})


//btn Edit


document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  if (!editBtn) return;

  const requestId = editBtn.getAttribute("data-id");
  const request = apiData.requests.find(r => r.id == requestId);
  if (!request) return;

  document.getElementById("editRequestId").value = request.id;
  document.getElementById("editType").value = request.type;
  document.getElementById("editStartDate").value = request.startDate;
  document.getElementById("editEndDate").value = request.endDate;
  document.getElementById("Justification").value = request.justification;

  document.getElementById("editModal").classList.remove("hidden");
});

document.getElementById("cancelEdit").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

// Open modal and fill data
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".btn-edit");
  if (!editBtn) return;

  const requestId = editBtn.getAttribute("data-id");
  const request = apiData.requests.find(r => r.id == requestId);
  if (!request) return;

  // Fill modal inputs
  document.getElementById("editRequestId").value = request.id;
  document.getElementById("editType").value = request.type; // select
  document.getElementById("editStartDate").value = request.startDate;
  document.getElementById("editEndDate").value = request.endDate;
  document.getElementById("Justification").value = request.justification;

  // Show modal
  document.getElementById("editModal").classList.remove("hidden");
});

// Close modal
document.getElementById("cancelEdit").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

// Submit edited request
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const requestId = document.getElementById("editRequestId").value;

  // Find the old request to preserve other fields
  const oldRequest = apiData.requests.find(r => r.id == requestId);
  if (!oldRequest) return alert("Request not found");

  const updatedRequest = {
    ...oldRequest, // keep all existing properties
    type: document.getElementById("editType").value,
    startDate: document.getElementById("editStartDate").value,
    endDate: document.getElementById("editEndDate").value,
    justification: document.getElementById("Justification").value,
    updatedAt: new Date().toISOString() // update timestamp
  };

  try {
    await axios.put(`http://localhost:3000/requests/${requestId}`, updatedRequest);

    alert("Demande mise à jour avec succès !");
    
    // Close modal
    document.getElementById("editModal").classList.add("hidden");

    // Refresh the cards on the page
    showCongeStatus(currentUserId);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Une erreur est survenue lors de la mise à jour.");
  }
});

// Close modal if clicked outside
document.getElementById("editModal").addEventListener("click", (e) => {
  if (e.target.id === "editModal") {
    e.target.classList.add("hidden");
  }
});


document.getElementById("editModal").addEventListener("click", (e) => {
  if (e.target.id === "editModal") e.target.classList.add("hidden");
});
