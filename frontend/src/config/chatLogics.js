import React from 'react'

const getSender = (loggedUser,users) => {
  return users[0]._id===loggedUser._id?users[0].name:users[0].name
}

export default getSender
