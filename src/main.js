import React from 'react'

const MainScreen = {
  render: (props) => {
    return (
      <div className='stimul-info'>
        <p>{props.response.hello}</p>
      </div>
    )
  },

  query: '{hello}'
}

export default MainScreen
