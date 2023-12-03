document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const autocompleteList = document.getElementById("autocomplete-list");
    const historyList = document.getElementById("repositories-list");

    function debounce(func, delay) {
        let timeoutId;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }
    function createRepositoryElement(repository) {
        const li = document.createElement("li");
        li.classList.add("repository-item");
    
        const nameElement = document.createElement("div");
        nameElement.innerHTML = `Name: ${repository.name}`;
    
        const ownerElement = document.createElement("div");
        ownerElement.innerHTML = `Owner: ${repository.owner.login}`;
    
        const starsElement = document.createElement("div");
        starsElement.innerHTML = `Stars: ${repository.stargazers_count}`;
    
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
    
        removeButton.addEventListener("click", function () {
            li.remove();
        });
    
        li.appendChild(nameElement);
        li.appendChild(ownerElement);
        li.appendChild(starsElement);
        li.appendChild(removeButton);
        historyList.appendChild(li);
    }
    
    

    function updateAutocompleteList(keyword) {
        console.log(keyword)
        fetch(`https://api.github.com/search/repositories?q=${keyword}&per_page=15`)
            .then(response => response.json())
            .then(data => {
                autocompleteList.innerHTML = "";
                data.items.forEach(repository => {
                    const li = document.createElement("li");
                    li.innerHTML = repository.name;
                    li.addEventListener("click", function () {
                        createRepositoryElement(repository);
                        searchInput.value = "";
                        autocompleteList.innerHTML = "";
                        autocompleteList.classList.remove("active");
                    });
                    autocompleteList.appendChild(li);
                });
                autocompleteList.classList.add("active");
            })
            .catch(error => console.error(error));
    }

    const debouncedUpdateAutocomplete = debounce(updateAutocompleteList, 400);
    searchInput.addEventListener("input", function () {  
        const keyword = searchInput.value.trim();  
        if (keyword) { 
            debouncedUpdateAutocomplete(keyword);  
        } else {  
            autocompleteList.innerHTML = "";  
            autocompleteList.classList.remove("active");  
        }  
    });
});
