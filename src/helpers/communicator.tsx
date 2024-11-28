import axios from "axios"


export const loginUser = async (
    username:string,
    password:string
)=>{
    const res = await axios.post("/user/login",{username, password});
    if(res.status != 200){
        throw new Error("Unable to Login.")
    }
    
    const data = await res.data;
    localStorage.setItem('userID',data.id)

    return data;
}

export const signUpUser = async (
    username:string,
    password:string
)=>{
    const res = await axios.post("/user/signup",{username, password});
    if(res.status != 201){
        throw new Error("Unable to Sign Up User.")
    }
    
    const data = await res.data;
    localStorage.setItem('userID',data.id)
    return data;
}

export const logoutUser = async () => {
    const res = await axios.get('/user/logout', {
      withCredentials: true,
    });
    
    if (res.status != 200) {
        throw new Error("Logout failed");;
    }

    const data = await res.data;
    localStorage.removeItem('userID')
    return data;

  };


export const checkAuthStatus = async () => {
    try{
        const res = await axios.get("/user/auth-status");
        if(res.status===403 || res.status===401){
            throw new Error("Error caught successfully")
        }
        const data = await res.data;
        return data;
    }
    catch(error){
        return null; 
    }
  };

// Content Functionalities
export const fetchData = async () =>{
    try{
        const res = await axios.get("/content/viewContent")
        if(res.status===404 || res.status===500){
            throw new Error("Error caught successfully")
        }
        
        const data = await res.data
        return data
    }
    catch(error){
        return null
    }
}

export const getAllTags = async () =>{
    const res = await axios.get("/content/getTags")
    if(res.status != 200){
        throw new Error("Unable to fetch tags.")
    }

    const data = await res.data;
    return data;
}

export const viewContent = async ()=>{
    const res = await axios.get("/content/viewContent");
    if(res.status != 200){
        throw new Error("Unable to Add content.")
    }

    const data = await res.data;
    return data;
}

export const addContent = async (
    title : string,
    link : string,
    type : string,
    tags : Array<{value : string}>,
    description? : string
)=>{

    const res = description ? await axios.post("/content/addContent",{title, description,link,type,tags}) : await axios.post("/content/addContent",{title,link,type,tags})
    
    if(res.status != 201){
        throw new Error("Unable to Add content.")
    }
    
    const data = await res.data;
    return data;
}

export const editContent = async (
    contentID : string,
    title : string,
    link : string,
    type : string,
    tags : Array<{value : string}>,
    description? : string
)=>{
    const res = description ? await axios.put("/content/updateContent",{contentID,title,link,type,tags,description}) : await axios.put("/content/updateContent",{contentID,title,link,type,tags})

    if(res.status != 200){
        throw new Error("Unable to Update content.")
    }
    
    const data = await res.data;
    return data;
}



export const deleteContent = async (
    contentID : string
) => {
    const res = await axios.delete("/content/deleteContent",{data : {contentID}})
    if(res.status != 200){
        throw new Error("Unable to Delete content")
    }

    const data = await res.data;
    return data
}

// Sharing Functionalities
export const linkStatus = async () => {
    const res = await axios.get("/share/linkStatus")
    if(res.status != 200){
        throw new Error("Unable to modify brain sharing status")
    }

    const data = await res.data;
    return data
}

export const shareBrain = async (
    share : boolean
) => {
    const res = await axios.post("/share/shareBrain",{share})
    if(res.status != 200 && res.status != 201){
        throw new Error("Unable to modify brain sharing status")
    }

    const data = await res.data;
    return data
}

export const viewBrain = async (username: string, uid: string) => {
    const res = await axios.get(`/share/viewBrain/${username}/${uid}`)
    if(res.status != 200 && res.status != 201){
        throw new Error("Unable to view shared brain.")
    }

    const data = await res.data;
    return data
}