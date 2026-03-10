const searchUserForm = document.querySelector(".search-for-user-form");

const userRepoContent = document.querySelector(".user-repo-container")

searchUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    resetForm();

    const username = event.target.querySelector(".username-input").value;
    
    const userData = await getUserData(username);
    
    if(!userData){
        return;
    }

    const userRepo = await getUserRepos(username);
    displayUserDataOnScreen(userData, userRepo);
    event.target.querySelector(".username-input").value=""
});


async function getUserData(username){
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if(response.ok){
        const data = await response.json();
        return data;
    }
    
    alert("Usuário não foi encontrado")

}

async function getUserRepos(username){
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
    
    const data = await response.json()
    return data;
}

async function getRepoLanguages(repo){
    const response = await fetch(`https://api.github.com/repos/${repo}/languages`);

    const data = await response.json()
    return data;
}

function displayUserDataOnScreen(userData, userRepo){

    document.querySelector(".user-data-container").classList.remove("hide")

    document.querySelector(".user-avatar").src = userData.avatar_url;
    document.querySelector(".user-avatar").alt=userData.name
    document.querySelector(".user-name").textContent=userData.name;
    document.querySelector(".user-login").textContent=userData.login;
    document.querySelector(".user-repos").textContent=userData.public_repos;
    document.querySelector(".user-followers").textContent=userData.followers;
    document.querySelector(".user-bio").textContent=userData.bio;
    document.querySelector(".user-first-access").textContent  = (new Date(userData.created_at)).toLocaleDateString("pt-BR")

    if(userRepo.length <= 0){
        userRepoContent.textContent  = "Nenhum repositório encontrado :("
        userRepoContent.classList.add("no-repo")
        return;
    }

    userRepo.forEach(async repo => {
        
        const userRepoLi = document.createElement("li")

        userRepoLi.classList.add("user-repo")

        const header = document.createElement("header")

        userRepoLi.appendChild(header)

        const repoTitle = document.createElement("strong")
        repoTitle.classList.add("repo-title")
        repoTitle.textContent = repo.name
        header.appendChild(repoTitle)

        const repoLink = document.createElement("a")
        repoLink.classList.add("repo-link")
        repoLink.href = repo.html_url
        repoLink.target = "_blank"
        repoLink.textContent="Ir para o repo"
        header.appendChild(repoLink)

        const repoDescription = document.createElement("p")
        repoDescription.classList.add("repo-description")
        repoDescription.textContent = repo.repoDescription
        userRepoLi.appendChild(repoDescription)

        const createdAtContainer = document.createElement("div")
        createdAtContainer.classList.add("created-at-container")
        createdAtContainer.textContent = "Criado em: "
        userRepoLi.appendChild(createdAtContainer)

        const repoCreatedAt = document.createElement("span")
        repoCreatedAt.classList.add("repo-created-at")

        const languages = await getRepoLanguages(repo.full_name)            
        const languagesCont = document.createElement("span")
        languagesCont.textContent = Object.keys(languages).splice(0, 3).join(" + ")
        userRepoLi.appendChild(languagesCont)

        const createdAt = new Date(repo.created_at)
        const createAtFormatted = new Intl.DateTimeFormat("pt-BR").format(createdAt)
        repoCreatedAt.textContent = createAtFormatted
        createdAtContainer.appendChild(repoCreatedAt)

        userRepoContent.appendChild(userRepoLi)
    })
}

function resetForm(){
    document.querySelector(".user-data-container").classList.add("hide")
    userRepoContent.replaceChildren()
    userRepoContent.classList.remove("no-repo")
}