export const uri: any =  process.env.MONGODB_URI != null && process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI :  "mongodb://localhost:27017"

export const hash: any = process.env.PASSWORD!= null && process.env.PASSWORD != undefined ? process.env.PASSWORD :  "123456"
