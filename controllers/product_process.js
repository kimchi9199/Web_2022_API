// basic process => return info
// f/b was build dependencies, use API to connect
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// back previous a folder
const proinfo = require("../data/product_info.json") ;

//export to export function for others to use
export const ListProduct = async (req,res) => {
    try
    {
        res.send(proinfo);
    }
    catch (error)
    {
        console.log(error);
    }
}
