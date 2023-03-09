import $http from "./index"


const getBooksData = (name: string) => {
    return $http.get(`books/${name}.json`)

}
export {getBooksData}
