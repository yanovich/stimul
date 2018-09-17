
export const updTask =(...params)=>{
    return(`mutation{
        updateTask(id: "${params[0]}", ${params[1]})
      }`)
};
export const getPriority = () => `{
    glossary{
        priorities{
          name
          id
        }
      }
    }
`;

export const getById = (id) => {
    return(
        `{
            task(id: ${id}) {
                id
                name
                description
                index
                columnId
                priority
              }
        }
        `)
};