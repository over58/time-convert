window.onload = function () {
  
  // 时间转换为时间戳
  document.getElementById("date2stamp").onclick = function date2stamp () {
    const outStampEl = document.getElementById("output-timestamp");
    const datetimeEl = document.getElementById("datetime-local");

    let datetime = datetimeEl.value;
    console.log(datetime);
    if(datetime) {
      console.log(new Date(datetime).getTime());
      outStampEl.value = new Date(datetime).getTime();
    }
  };


  // 时间戳转换为时间
  document.getElementById("stamp2date").onclick = function stamp2date () {
    const out = document.getElementById("output-date");
    const timestamp = document.getElementById("timestamp").value;
    const unixtime = timestamp.match(/\d{10,13}/g);
    if(unixtime) {
      let date;
      if (unixtime[0].length === 10) {
        date = new Date(Number(unixtime[0]) * 1000);
      } else if (unixtime[0].length === 13) {
        date = new Date(Number(unixtime[0]));
      }
      out.value = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
  };
};
