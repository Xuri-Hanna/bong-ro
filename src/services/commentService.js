import axios from 'axios'

let token = null

const setToken = newToken => {
    token = newToken
}

const addComment = async commentObj => {
    const bodyToSend = {
        token,
        ...commentObj

    }

    

    console.log("body", bodyToSend)
    const url = "/api/comment"
    const response = await axios.post(url, bodyToSend)
    console.log("response.data", response.data)
    return response.data
}


const getAllComments = async () => {
    const path = "/api/comments"
    const response = await axios.get(path)
    return response.data
}

const approveComment = async (comment) => {
    console.log("comment comes", comment)
    const path = `/api/comments/${comment._id}`
    const newComment = {...comment, approval: !comment.approval }
    console.log("new", newComment)
    const response = await axios.put(path, newComment)
    return response.data
}

const commentService = { setToken, addComment, getAllComments, approveComment }
export default commentService