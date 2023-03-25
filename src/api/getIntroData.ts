import $http from "./index"

const getIntroData = (name: string) => $http.get(`books/${name}.json`)

export {getIntroData}
