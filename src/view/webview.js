window.onload = function () {
  const outStampEl = document.getElementById("output-timestamp");
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");

  outStampEl.value = dateEl.value + '____adsfasdfa';
  function date2stamp () {
    const date = dateEl.value;
    const time = timeEl.value;
    const outStampEl = document.getElementById("output-timestamp");
    outStampEl.html = date + '_' + time;
  }
};