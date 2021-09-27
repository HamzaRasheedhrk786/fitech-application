const NodeGeocoder = require('node-geocoder');
 
// const options = {
//   provider:"mapquest",
//   // countryCode: 'Pakistan',
 
// // Optional depending on the providers
// //   fetch: customFetchImplementation,
//   httpAdapter:"http",
//   // contentType:'json',
//   apiKey:"m5WvGxLwKVwUkvVJjb2ZzAadfFPIURES", // for Mapquest, OpenCage, Google Premier
//   formatter: null // 'gpx', 'string', ...
// };
const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'm5WvGxLwKVwUkvVJjb2ZzAadfFPIURES',
  formatter: null
}
 
const geocoder = NodeGeocoder(options);
 // Using callback
// const res = await geocoder.geocode('29 champs elysée paris',function(err,res){
//     console.log(res)
// })
module.exports=geocoder;