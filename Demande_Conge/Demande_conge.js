let currentUserId = 1

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
        
        mesDernieresConge(currentUserId)
        
        
    } catch (error) {

        console.error('Error loading data:', error)

    }
}
loaddata()


// demande conge page



document.getElementById("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  // Get form values
  const startDate = document.getElementById("Date-début").value;
  const endDate = document.getElementById("Date-fin").value;
  const type = document.getElementById("Type-congé").value;
  const justification = document.getElementById("Justification").value;
  

   if (!startDate || !endDate || !type || !justification) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
   if (days <= 0) {
    alert("La date de fin doit être après la date de début !");
    return;
  }

  const newRequest = {
    userId: 1, 
    type: type,
    startDate: startDate,
    endDate: endDate,
    days: days,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    approverId: null,
    approverComment: null,
    justification: justification
  };
  try {
    
    const response = await axios.post("http://localhost:3000/requests", newRequest);

    console.log("Demande ajoutée avec succès :", response.data);
    alert("Votre demande a été soumise avec succès !");
    e.target.reset();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande :", error);
    alert("Une erreur s'est produite lors de l'envoi de la demande.");
  }
})




const lastleave1 = document.getElementById("lastleave1")
const lastleave2 = document.getElementById("lastleave2")

function mesDernieresConge(userId = currentUserId){
  const requests = apiData.requests;

  const userRequests = requests
    .filter(item => parseInt(item.userId) === parseInt(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (userRequests.length === 0) {
    lastleave1.innerHTML = "<p>Aucune demande trouvée</p>";
    lastleave2.innerHTML = "";
    return;
  }

  const [latest, secondLatest] = userRequests;
  let color = ""

  if (latest.status === "pending") {
    color = "bg-[#FACC15]/40"; 
  } else if (latest.status === "approved") {
    color = "bg-[#22C55E]/40"; 
  } else {
    color = "bg-[#EF4444]/40";
  }

 if (latest) {
    lastleave1.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="bg-black w-2.5 h-2.5 rounded-full mr-2"></div>
        <div class="flex-col">
          <p class="text-[#111827]">${latest.type}</p>
          <p class="text-[#4B5563]">${latest.startDate} → ${latest.endDate}</p>
        </div>
      </div>
      <div class=" ${color} backdrop-blur-md w-26 h-9 rounded-xl 
               flex items-center justify-center border border-white/20 shadow-md text-black">
                    ${latest.status}
      </div>`;
  }

  // Second request
  if (secondLatest) {
    let secondColor = "";

    
    if (secondLatest.status === "pending") {
      secondColor = "bg-[#FACC15]/40";
    } else if (secondLatest.status === "approved") {
      secondColor = "bg-[#22C55E]/40";
    } else {
      secondColor = "bg-[#EF4444]/40";
    }

    lastleave2.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="bg-black w-2.5 h-2.5 rounded-full mr-2"></div>
        <div class="flex-col">
          <p class="text-[#111827]">${secondLatest.type}</p>
          <p class="text-[#4B5563]">${secondLatest.startDate} → ${secondLatest.endDate}</p>
        </div>
      </div>
      <div class="${secondColor} backdrop-blur-md w-26 h-9 rounded-xl 
               flex items-center justify-center border border-white/20 shadow-md text-black">
                    ${secondLatest.status}
      </div>`;
  }

}