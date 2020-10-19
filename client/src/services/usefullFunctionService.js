export function checkValidState(data) {
  const tab = Object.values(data);
  for (let i = 0; i < tab.length; i++) {
    if (tab[i] === "") return false;
  }
  return true;
}
