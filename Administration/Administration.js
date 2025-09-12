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
    showRequestsTotal()
    showAllDemandes()


  } catch (error) {

    console.error('Error loading data:', error)

  }
}
loaddata()


// load statistique of the month




function showRequestsTotal() {
  const requests = apiData.requests;
  if (!requests || requests.length === 0) {
    console.warn("No requests data available.");
    return;
  }

  // Get current year and month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec

  // Filter only current month's requests
  const monthlyRequests = requests.filter(req => {
    const startDate = new Date(req.startDate);
    return (
      startDate.getFullYear() === currentYear &&
      startDate.getMonth() === currentMonth
    );
  });

  // Group by status
  const approved = monthlyRequests.filter(r => r.status === "approved");
  const pending = monthlyRequests.filter(r => r.status === "pending");
  const rejected = monthlyRequests.filter(r => r.status === "rejected");
  const total = approved.length + pending.length + rejected.length

  // Select HTML containers

  const enAttenteContainer = document.getElementById("enAttenteContainer")
  const approvedContainer = document.getElementById("approvedContainer")
  const refusedContainer = document.getElementById("refusedContainer")
  const totalContainer = document.getElementById("totalContainer")


  // Clear old content
  approvedContainer.innerHTML = "";
  enAttenteContainer.innerHTML = "";
  refusedContainer.innerHTML = "";
  totalContainer.innerHTML = "";

  approvedContainer.innerHTML = `<p class="text-[var(--heading-color)] text-xl font-semibold">${approved.length}</p>`;
  enAttenteContainer.innerHTML = `<p class="text-[var(--heading-color)] text-xl font-semibold">${pending.length}</p>`;
  refusedContainer.innerHTML = `<p class="text-[var(--heading-color)] text-xl font-semibold">${rejected.length}</p>`;
  totalContainer.innerHTML = `<p class="text-[var(--heading-color)] text-xl font-semibold">${total}</p>`;




}


// displaying cards

const statusSelect = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");


function showAllDemandes() {
  const cardContainer = document.getElementById("cardContainer");
  const statusSelect = document.getElementById("statusFilter"); // status filter dropdown
  const searchInput = document.getElementById("searchInput");   // search input field

  const requests = apiData.requests;
  const users = apiData.users;

  if (!requests || requests.length === 0) {
    cardContainer.innerHTML = "No requests data available.";
    return;
  }

  
  const selectedStatus = statusSelect.value;
  const searchQuery = searchInput.value.toLowerCase();

  cardContainer.innerHTML = "";

 
  const sortedRequests = [...requests].sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  
  let filteredRequests = sortedRequests;

  // Filter by status
  if (selectedStatus !== "Tous les statuts") {
    filteredRequests = filteredRequests.filter(function (req) {
      return req.status === selectedStatus;
    });
  }

  // Filter by name
  if (searchQuery !== "") {
    filteredRequests = filteredRequests.filter(function (req) {
      const user = users.find(function (u) {
        return String(u.id) === String(req.userId);
      });

      if (!user) return false;

      const fullName = (user.firstName + " " + user.lastName).toLowerCase();
      return fullName.includes(searchQuery);
    });
  }

 
  if (filteredRequests.length === 0) {
    cardContainer.innerHTML = "<p>Aucune demande trouvée.</p>";
    return;
  }

 
  filteredRequests.forEach(function (req) {
    const user = users.find(function (u) {
      return String(u.id) === String(req.userId);
    });

    let userName = "Utilisateur inconnu";
    let userRole = "Role inconnu";

    if (user) {
      userName = user.firstName + " " + user.lastName;
      userRole = user.role;
    }

    let statusColor = "";
    let card = document.createElement("div");

    
    if (req.status === "pending") {
      statusColor = "bg-[#FACC15]/40 text-yellow-800";
      card.innerHTML = `
        <div class="bg-white border border-gray-200 shadow-sm rounded-2xl w-70 h-70 p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-3">
              <i class="fa-solid fa-user text-gray-500"></i>
              <div>
                <p class="text-gray-900 font-medium">${userName}</p>
                <p class="text-gray-500 text-sm">${userRole}</p>
              </div>
            </div>
            <div class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl">
              ${req.status}
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><p class="text-gray-500">Type :</p><p class="text-gray-900">${req.type}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Du :</p><p class="text-gray-900">${req.startDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Au :</p><p class="text-gray-900">${req.endDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Durée :</p><p class="text-gray-900">${req.days}</p></div>
          </div>
          <div class="flex justify-between gap-3 pt-4">
            <div data-id="${req.id}" class="btn-Approve flex items-center justify-center gap-1 w-30 h-10 rounded-xl bg-[var(--btnApprove-color)] text-white font-medium shadow-sm hover:bg-[#3f3a76] transition-all duration-200 cursor-pointer">
              <i class="fa-solid fa-check"></i> Approuver
            </div>
            <div data-id="${req.id}" class="btn-Refuse flex items-center justify-center gap-1 w-30 h-10 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <i class="fa-solid fa-xmark"></i> Refuser
            </div>
          </div>
        </div>`;
    }

    
    else if (req.status === "approved") {
      statusColor = "bg-[#22C55E]/40 text-green-800";
      card.innerHTML = `
        <div class="bg-white border border-gray-200 shadow-sm rounded-2xl w-70 h-70 p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-3">
              <i class="fa-solid fa-user text-gray-500"></i>
              <div>
                <p class="text-gray-900 font-medium">${userName}</p>
                <p class="text-gray-500 text-sm">${userRole}</p>
              </div>
            </div>
            <div class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl">
              ${req.status}
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><p class="text-gray-500">Type :</p><p class="text-gray-900">${req.type}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Du :</p><p class="text-gray-900">${req.startDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Au :</p><p class="text-gray-900">${req.endDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Durée :</p><p class="text-gray-900">${req.days}</p></div>
          </div>
          <div class="flex justify-between gap-3 pt-4">
            <div data-id="${req.id}" class="btn-Approve flex items-center justify-center gap-1 w-30 h-10 rounded-xl bg-gray-200 text-gray-700 font-medium shadow-sm">
              <i class="fa-solid fa-check"></i> Approuvé
            </div>
            <div data-id="${req.id}" class="btn-Voir flex items-center justify-center gap-1 w-30 h-10 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <i class="fa-solid fa-eye"></i> Voir
            </div>
          </div>
        </div>`;
    }

    
    else {
      statusColor = "bg-[#EF4444]/40 text-red-800";
      card.innerHTML = `
        <div class="bg-white border border-gray-200 shadow-sm rounded-2xl w-70 h-70 p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-3">
              <i class="fa-solid fa-user text-gray-500"></i>
              <div>
                <p class="text-gray-900 font-medium">${userName}</p>
                <p class="text-gray-500 text-sm">${userRole}</p>
              </div>
            </div>
            <div class="${statusColor} backdrop-blur-md text-black text-xs px-3 py-1 rounded-xl">
              ${req.status}
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><p class="text-gray-500">Type :</p><p class="text-gray-900">${req.type}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Du :</p><p class="text-gray-900">${req.startDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Au :</p><p class="text-gray-900">${req.endDate}</p></div>
            <div class="flex justify-between"><p class="text-gray-500">Durée :</p><p class="text-gray-900">${req.days}</p></div>
          </div>
          <div class="flex justify-between gap-3 pt-4">
            <div data-id="${req.id}" class="btn-Delete flex items-center justify-center gap-1 w-30 h-10 rounded-xl bg-red-300 cursor-pointer text-gray-700 font-medium shadow-sm">
              <i class="fa-solid fa-trash"></i> Delete
            </div>
            <div data-id="${req.id}" class="btn-Voir flex items-center justify-center gap-1 w-30 h-10 rounded-xl border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer">
              <i class="fa-solid fa-eye"></i> Voir
            </div>
          </div>
        </div>`;
    }

    cardContainer.appendChild(card);
  });
}

statusSelect.addEventListener("change", function() {
  const selectedStatus = statusSelect.value;
  const searchQuery = searchInput.value;
  showAllDemandes(selectedStatus, searchQuery);
});


searchInput.addEventListener("input", function() {
  const selectedStatus = statusSelect.value;
  const searchQuery = searchInput.value;
  showAllDemandes(selectedStatus, searchQuery);
});


document.addEventListener("click", async (e) => {
  
  const approveBtn = e.target.closest(".btn-Approve");
  const refuseBtn = e.target.closest(".btn-Refuse");

  if (!approveBtn && !refuseBtn) return; // exit if neither clicked

  
  const button = approveBtn || refuseBtn;
  const requestId = button.getAttribute("data-id");
  if (!requestId) return;

  
  const request = apiData.requests.find(r => r.id == requestId);
  if (!request) return alert("Request not found");

  
  let newStatus = "";
  if (approveBtn) {
    newStatus = "approved";
  } else if (refuseBtn) {
    newStatus = "rejected";
  }

  
  const updatedRequest = {
    ...request,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  try {
    await axios.put(`http://localhost:3000/requests/${requestId}`, updatedRequest);
    alert(`Demande ${newStatus} avec succès !`);

    
    showAllDemandes();
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Une erreur est survenue lors de la mise à jour.");
  }
});






