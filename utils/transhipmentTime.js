const transhipmentTime = (time, addDayA, addDayB) => {
  var a = time.toString().replace(".0", "");
  a = a.replace("/", "-");

  a = a.split("-");
  let b = [...a];
  console.log("b:    ", b.length);
  // a = a.map(item => item-0+addDay)
  if (b.length > 1) {
      a = a.map((item, index) => {
          item = index == 0 ? item - 0 + addDayA : item;
          item = index == 1 ? item - 0 + addDayB : item;
          return item;
      });
  } else {
      a = a.map(item => item - 0 + addDayA + addDayB);
  }
  return a.join("-");
}

// 运输时间的整理
function transtime(item){
  if (a.stage3TransitTime == "") {
    a.stage3TransitTime = "4.0";
  }
  let b = a.transshipment.split("/");
  if (a.transshipment != "DIR") {
    a.stage3TransitTime = transhipmentTime(
      a.stage3TransitTime,
      0,
      b.length
    );
  }
}

module.exports = transtime
