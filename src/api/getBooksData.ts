import $http from "./index"

const getBooksData = (name: string) => $http.get(`books/${name}.json`)

export {getBooksData}
