import Api from './api/api';

async function getList() {
  const api = new Api();

  console.log(await api.getMinMax("area"));
}

const btn = document.querySelector("button");
btn?.addEventListener("click", getList);
