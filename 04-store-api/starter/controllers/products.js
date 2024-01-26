const Product = require("../models/product");

/* 4:34:13 */

const getAllProductsStatic = async (req, res) => {
  
  const products = await Product.find({price:{$gt:30}}).select('price').sort('price');
  res.status(200).json({ products, nbHits:products.length });
};
const getAllProducts = async (req, res) => {
  const {featured, company, name, sort, fields, numericFilters} = req.query
  const queryObject = {}

  /* Check if query parameter is exists before assigning. */
  if(featured){
    queryObject.featured = featured === 'true'? true : false
  }
  if(company){ 
    queryObject.company = company
  }
  if(name){
    /* Regex is from MongoDb's library mongodump, and its used to pattern search strings in queries. */
    queryObject.name = {$regex:name,$options: 'i'}
  }
  if(numericFilters){
    /* Mapping out the expression values to a more user friendly experience */
    const operatorMap = {
      '>':'$gt',
      '>=':'$gte',
      '=':'$eq',
      '<':'$lt',
      '<=':'$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match)=>`-${operatorMap[match]}-`
    )
    const options = ['price','rating'];
    filters = filters.split(',').forEach((item)=>{
      const [field, operator, value] = item.split('-');
      if(options.includes(field)){
        queryObject[field] = {[operator]:Number(value)}
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject)
  if(sort){
    /* Removes the comma and creates an array */
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  }
  else{
    result = result.sort('createAt');
  }
if(fields){
    /* Select returns only the specified parameters associated with the ids */
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
}
  /* Cast the string into a usable number to hard code the default values */
  /* The purpose of the skip math is for displaying how much data per page based on the limit */
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  /* 23 */

  const products = await result
  res.status(200).json({ products, nbHits: products.length});
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
