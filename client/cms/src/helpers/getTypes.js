import axios from "axios"

/* eslint-disable no-useless-catch */
export const getTypes = async () => {
  try {
    const { data } = await axios({
      url: "https://oxo-server.nokatotedo.my.id/types",
      headers: {
        "Authorization": 'Bearer ' + localStorage.access_token
      }
    })

    return data
  } catch (error) {
    throw(error)
  }
}