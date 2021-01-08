const listNumberOfRoom = [{value :null , name:"Không xác định"},
{value :1 , name:"1"},
{value :2 , name:"2"},
{value :3 , name:"3"},
{value :4 , name:"4"},
{value :5 , name:"5"},
]
const listPrice = [
{fromPrice :1 ,fromToPrice:500000000, name:"Dưới 500 triệu" },
{fromPrice :500000000 ,fromToPrice:800000000, name:"500 - 800 triệu"},
{fromPrice :800000000 ,fromToPrice:1000000000, name:"800 triệu - 1 tỷ"},
{fromPrice :1000000000 ,fromToPrice:2000000000, name:"1 - 2 tỷ"},
{fromPrice :2000000000 ,fromToPrice:3000000000, name:"2 - 4 tỷ"},
{fromPrice :3000000000 ,fromToPrice:500000000, name:"3 - 5 tỷ"},
{fromPrice :5000000000 ,fromToPrice:700000000, name:"5 - 7 tỷ"},
{fromPrice :7000000000 ,fromToPrice:1000000000, name:"7 - 10 tỷ"},
{fromPrice :10000000000 ,fromToPrice:2000000000, name:"10 - 20 tỷ"},
]

module.exports = Object.freeze({
    //ROOT_PATH : "/egret/",
    listNumberOfRoom: listNumberOfRoom,
    listPrice:listPrice,
  });