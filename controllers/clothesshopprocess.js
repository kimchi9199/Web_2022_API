// basic process => return info
// f/b was build dependencies, use API to connect
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// back previous a folder
const shopinfo = require("../data/clothesshopinfo.json") ;

//export to export function for others to use
export const Introduce = async (req,res) => {
    try
    {
        res.send(shopinfo);
    }
    catch (error)
    {
        console.log(error);
    }
}
